import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entities/comment.entity';

/**
 * Standard UUID regex (v1-v5)
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * IsCommentAuthorGuard:
 * Ensures that the requesting client owns the target comment (comment.author_id === userId).
 * Protects comment modification and deletion endpoints.
 */
@Injectable()
export class IsCommentAuthorGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Extract commentId from request.params.id (or request.params.commentId for flexibility)
    const commentId: string = request.params?.id || request.params?.commentId;

    // Validate UUID format before querying PostgreSQL to prevent 500 syntax error crashes
    if (!commentId || !UUID_REGEX.test(commentId)) {
      throw new NotFoundException('Comment not found');
    }

    // 2. Extract requesting userId from flexible headers or request.user?.id
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

    // 3. Look up the comment in the database (excluding soft-deleted comments)
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        deleted_at: IsNull(),
      },
    });

    // 4. If comment not found, throw NotFoundException('Comment not found')
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // 5. If comment.author_id !== userId, throw ForbiddenException
    if (!userId || comment.author_id.trim().toLowerCase() !== userId.toLowerCase()) {
      throw new ForbiddenException('You are not authorized to modify this comment');
    }

    // 6. If matching, attach comment to request and return true
    request.comment = comment;
    return true;
  }
}

