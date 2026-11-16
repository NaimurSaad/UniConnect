import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RequireUserGuard implements CanActivate {
  private readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 1. Extract user ID from auth guard (JWT) or headers fallback
    let rawUserId =
      request.user?.id ||
      request.headers['user-id'] ||
      request.headers['x-user-id'] ||
      request.headers['user_id'];

    if (Array.isArray(rawUserId)) {
      rawUserId = rawUserId[0];
    }

    if (!rawUserId) {
      throw new UnauthorizedException(
        'User authentication or user-id header is required.',
      );
    }

    const userId = String(rawUserId).trim();

    // 2. Validate UUID format
    if (!this.UUID_REGEX.test(userId)) {
      throw new BadRequestException('Invalid user-id UUID format.');
    }

    // Attach sanitized user back to request for consistency
    if (!request.user) {
      request.user = { id: userId };
    }

    return true;
  }
}

