import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { FeedPost, PostVisibility } from './entities/feed-post.entity';
import { PostMedia } from './entities/post-media.entity';
import { Comment } from './entities/comment.entity';
import { Reaction, ReactionType } from './entities/reaction.entity';
import { User } from '../users/entities/user.entity';
import {
  CreatePostDto,
  CreatePostMediaDto,
  UpdatePostDto,
  CreateCommentDto,
  SetReactionDto,
  FeedQueryDto,
  FeedPaginationDto,
} from './dto';

@Injectable()
export class SocialFeedService {
  // Default fallback user ID for seamless Postman testing before Auth module is merged
  public static readonly DEFAULT_TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

  constructor(
    @InjectRepository(FeedPost)
    private readonly feedPostRepository: Repository<FeedPost>,
    @InjectRepository(PostMedia)
    private readonly postMediaRepository: Repository<PostMedia>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Helper to ensure an author/user exists in the database.
   * If author_id is missing or doesn't exist, ensures a stub test user is present
   * to satisfy PostgreSQL foreign key constraints during local testing.
   */
  async ensureUserExists(userId?: string): Promise<string> {
    const targetId = userId || SocialFeedService.DEFAULT_TEST_USER_ID;

    const existing = await this.userRepository.findOne({ where: { id: targetId } });
    if (!existing) {
      const stubUser = this.userRepository.create({
        id: targetId,
        full_name: 'Nizam Uddin Shuvo (Student 2)',
        email: `student2_${targetId.substring(0, 8)}@uniconnect.aiub.edu`,
        password_hash: 'stub_hashed_password',
        account_status: 'active',
      });
      await this.userRepository.save(stubUser);
    }
    return targetId;
  }

  /**
   * Health check endpoint confirming module & entity availability.
   */
  async getHealthCheck() {
    return {
      status: 'success',
      message: 'SocialFeedModule and database connection are active',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 1. Create a Feed Post with Transactional Persistence.
   * Atomically persists FeedPost and attached PostMedia entries using QueryRunner.
   */
  async createPost(createPostDto: CreatePostDto, headerUserId?: string): Promise<FeedPost> {
    const hasContent = createPostDto.content && createPostDto.content.trim().length > 0;
    const hasMedia = createPostDto.media && createPostDto.media.length > 0;

    if (!hasContent && !hasMedia) {
      throw new BadRequestException(
        'A feed post must contain either text content or at least one media item.',
      );
    }

    const resolvedAuthorId = await this.ensureUserExists(createPostDto.author_id || headerUserId);

    // 1. Initialize QueryRunner for transactional control
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Instantiate and save the FeedPost record
      const postEntity = queryRunner.manager.create(FeedPost, {
        author_id: resolvedAuthorId,
        content: hasContent ? createPostDto.content!.trim() : null,
        visibility: createPostDto.visibility || PostVisibility.COMMUNITY,
      });

      const savedPost = await queryRunner.manager.save(FeedPost, postEntity);

      // 3. If media contains items, loop through, attach post_id, and save to PostMedia
      if (hasMedia) {
        for (let i = 0; i < createPostDto.media!.length; i++) {
          const item = createPostDto.media![i];
          const mediaEntity = queryRunner.manager.create(PostMedia, {
            post_id: savedPost.id,
            media_type: item.media_type,
            file_url: item.file_url,
            mime_type: item.mime_type,
            file_size_bytes: item.file_size_bytes.toString(),
            sort_order: item.sort_order ?? i,
          });
          await queryRunner.manager.save(PostMedia, mediaEntity);
        }
      }

      // 4. Commit the transaction
      await queryRunner.commitTransaction();

      // 5. Retrieve and return the complete post including its attached media relations
      const completePost = await this.feedPostRepository.findOne({
        where: { id: savedPost.id },
        relations: ['media'],
        order: {
          media: {
            sort_order: 'ASC',
          },
        },
      });

      return completePost || savedPost;
    } catch (error) {
      // 6. Rollback transaction cleanly on any failure
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create post transactionally: ${(error as Error).message}`,
      );
    } finally {
      // 7. ALWAYS release queryRunner to prevent connection pool exhaustion
      await queryRunner.release();
    }
  }

  /**
   * 2. Cursor-Based Feed Pagination & Query Optimization.
   */
  async getFeed(paginationDto: FeedPaginationDto) {
    const { limit = 10, cursor } = paginationDto;
    const query = this.feedPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.media', 'media')
      .loadRelationCountAndMap('post.comments_count', 'post.comments')
      .loadRelationCountAndMap('post.reactions_count', 'post.reactions')
      .where('post.deleted_at IS NULL');

    if (cursor) {
      query.andWhere('post.created_at < :cursor', { cursor });
    }

    const posts = await query
      .orderBy('post.created_at', 'DESC')
      .addOrderBy('media.sort_order', 'ASC')
      .take(limit)
      .getMany();

    const next_cursor =
      posts.length > 0 ? posts[posts.length - 1].created_at : null;

    return {
      data: posts,
      limit,
      next_cursor,
      has_more: posts.length === limit,
    };
  }

  /**
   * Backward-compatible getFeedPosts delegator
   */
  async getFeedPosts(query: FeedPaginationDto | FeedQueryDto) {
    return this.getFeed(query as FeedPaginationDto);
  }

  /**
   * 3. Get Single Post by ID.
   * Excludes soft-deleted posts and eagerly loads media, comments, and reactions.
   */
  async getPostById(id: string): Promise<FeedPost> {
    const post = await this.feedPostRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['media', 'comments', 'reactions'],
      order: {
        media: { sort_order: 'ASC' },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return post;
  }

  /**
   * 4. Update Post Content / Visibility.
   * Only active (non-deleted) posts can be updated.
   */
  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<FeedPost> {
    const post = await this.getPostById(id);
    if (updatePostDto.content !== undefined) {
      post.content = updatePostDto.content;
    }
    if (updatePostDto.visibility !== undefined) {
      post.visibility = updatePostDto.visibility;
    }
    return this.feedPostRepository.save(post);
  }

  /**
   * 5. Soft Delete Post.
   * Sets deleted_at timestamp using TypeORM softDelete.
   */
  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    await this.getPostById(id);
    await this.feedPostRepository.softDelete(id);
    return {
      success: true,
      message: 'Post soft-deleted successfully',
    };
  }

  /**
   * 6. Add a Comment to a Post.
   */
  async addComment(postId: string, dto: CreateCommentDto, headerUserId?: string) {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`FeedPost with ID ${postId} not found.`);
    }

    const resolvedAuthorId = await this.ensureUserExists(dto.author_id || headerUserId);

    const comment = this.commentRepository.create({
      post_id: postId,
      author_id: resolvedAuthorId,
      content: dto.content.trim(),
    });

    return await this.commentRepository.save(comment);
  }

  /**
   * 7. Get Comments for a Post.
   */
  async getComments(postId: string) {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`FeedPost with ID ${postId} not found.`);
    }

    const comments = await this.commentRepository.find({
      where: { post_id: postId },
      relations: { author: true },
      order: { created_at: 'ASC' },
    });

    return {
      status: 'success',
      post_id: postId,
      total: comments.length,
      data: comments.map((c) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        author: c.author
          ? {
            id: c.author.id,
            full_name: c.author.full_name,
            email: c.author.email,
          }
          : null,
      })),
    };
  }

  /**
   * 8. Soft Delete a Comment.
   */
  async deleteComment(commentId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found.`);
    }

    await this.commentRepository.softDelete(commentId);
    return {
      status: 'success',
      message: `Comment ${commentId} has been soft-deleted.`,
    };
  }

  /**
   * 9. Set or Update Reaction.
   * Business Rule: "At most one reaction per user per post; updates change reaction_type."
   */
  async setReaction(postId: string, dto: SetReactionDto, headerUserId?: string) {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`FeedPost with ID ${postId} not found.`);
    }

    const resolvedUserId = await this.ensureUserExists(dto.user_id || headerUserId);

    const existingReaction = await this.reactionRepository.findOne({
      where: {
        post_id: postId,
        user_id: resolvedUserId,
      },
    });

    if (existingReaction) {
      existingReaction.reaction_type = dto.reaction_type;
      return await this.reactionRepository.save(existingReaction);
    }

    // Create new reaction
    const newReaction = this.reactionRepository.create({
      post_id: postId,
      user_id: resolvedUserId,
      reaction_type: dto.reaction_type,
    });

    return await this.reactionRepository.save(newReaction);
  }

  /**
   * 10. Remove Reaction.
   */
  async removeReaction(postId: string, userId?: string, headerUserId?: string) {
    const resolvedUserId = userId || headerUserId || SocialFeedService.DEFAULT_TEST_USER_ID;

    const existing = await this.reactionRepository.findOne({
      where: {
        post_id: postId,
        user_id: resolvedUserId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Reaction not found for this user on this post.');
    }

    await this.reactionRepository.remove(existing);
    return {
      status: 'success',
      message: 'Reaction removed successfully.',
    };
  }

  /**
   * 11. Add Media Attachment to an existing Post.
   */
  async addMediaToPost(postId: string, dto: CreatePostMediaDto): Promise<PostMedia> {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`FeedPost with ID ${postId} not found.`);
    }

    let sortOrder = dto.sort_order;
    if (sortOrder === undefined) {
      const currentCount = await this.postMediaRepository.count({
        where: { post_id: postId },
      });
      sortOrder = currentCount;
    }

    const media = this.postMediaRepository.create({
      post_id: postId,
      media_type: dto.media_type,
      file_url: dto.file_url,
      mime_type: dto.mime_type,
      file_size_bytes: dto.file_size_bytes.toString(),
      sort_order: sortOrder,
    });

    return await this.postMediaRepository.save(media);
  }

  /**
   * 12. Get Media Attachments for a Post.
   */
  async getPostMedia(postId: string): Promise<PostMedia[]> {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`FeedPost with ID ${postId} not found.`);
    }

    return await this.postMediaRepository.find({
      where: { post_id: postId },
      order: { sort_order: 'ASC', created_at: 'ASC' },
    });
  }

  /**
   * 13. Delete a Media Attachment.
   */
  async deleteMedia(mediaId: string): Promise<{ status: string; message: string }> {
    const media = await this.postMediaRepository.findOne({ where: { id: mediaId } });
    if (!media) {
      throw new NotFoundException(`PostMedia with ID ${mediaId} not found.`);
    }

    await this.postMediaRepository.remove(media);
    return {
      status: 'success',
      message: `Media attachment ${mediaId} deleted successfully.`,
    };
  }
}
