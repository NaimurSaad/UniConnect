import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { FeedPost } from '../entities/feed-post.entity';

/**
 * Standard UUID regex (v1-v5)
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * IsPostAuthorGuard:
 * Ensures that the requesting client owns the target post (author_id === userId).
 * Protects post modification and owner-sensitive routes.
 */
@Injectable()
export class IsPostAuthorGuard implements CanActivate {
  constructor(
    @InjectRepository(FeedPost)
    private readonly feedPostRepository: Repository<FeedPost>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Extract postId from request.params.id
    const postId: string = request.params?.id;

    // Validate UUID format before querying PostgreSQL to prevent 500 syntax error crashes
    if (!postId || !UUID_REGEX.test(postId)) {
      throw new NotFoundException('Post not found');
    }

    // 2. Extract requesting userId from flexible headers or request.user?.id
    // Supports 'user-id', 'x-user-id', 'user_id', 'author-id', 'x-author-id'
    const rawHeader =
      request.headers['user-id'] ||
      request.headers['x-user-id'] ||
      request.headers['user_id'] ||
      request.headers['author-id'] ||
      request.headers['x-author-id'];

    const userId: string | undefined = (
      Array.isArray(rawHeader) ? rawHeader[0] : rawHeader || request.user?.id
    )
      ?.toString()
      .trim();

    // 3. Look up the post in the database (excluding soft-deleted posts)
    const post = await this.feedPostRepository.findOne({
      where: {
        id: postId,
        deleted_at: IsNull(),
      },
    });

    // 4. If post not found, throw NotFoundException('Post not found')
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 5. If post.author_id !== userId, throw ForbiddenException
    if (!userId || post.author_id.trim().toLowerCase() !== userId.toLowerCase()) {
      throw new ForbiddenException('You are not authorized to modify this post');
    }

    // 6. If matching, attach post to request and return true
    request.post = post;
    return true;
  }
}
