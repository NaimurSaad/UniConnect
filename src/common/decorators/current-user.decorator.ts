import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 1. Check if user was set by JwtAuthGuard
    let user = request.user;

    // 2. Fallback to header or body for flexible testing
    if (!user) {
      const headerUserId =
        request.headers['user-id'] ||
        request.headers['x-user-id'] ||
        request.headers['user_id'];
      if (headerUserId) {
        user = { id: Array.isArray(headerUserId) ? headerUserId[0] : headerUserId };
      }
    }

    if (!user) {
      return null;
    }

    return data ? user?.[data] : user;
  },
);

export const OptionalCurrentUser = CurrentUser;
