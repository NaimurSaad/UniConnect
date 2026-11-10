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

    // 2. Extract requesting userId from request.headers['user-id'], 'x-user-id', or request.user?.id
    const rawHeader = request.headers['user-id'] || request.headers['x-user-id'];
    const userId: string | undefined = Array.isArray(rawHeader)
      ? rawHeader[0]
      : rawHeader || request.user?.id;

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
    if (!userId || post.author_id !== userId) {
      throw new ForbiddenException('You are not authorized to modify this post');
    }

    // 6. If matching, attach post to request and return true
    request.post = post;
    return true;
  }
}

