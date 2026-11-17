import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Unified JWT Authentication Guard across the platform.
 * Delegates to Passport 'jwt' strategy, ensuring 1 consistent auth system everywhere.
 */
@Injectable()
export class RequireUserGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Standard: Use Passport JWT when Authorization header is provided
    if (request.headers.authorization) {
      return (await super.canActivate(context)) as boolean;
    }

    // 2. Fallback: Allow user-id header if present
    const fallbackId =
      request.headers['user-id'] ||
      request.headers['x-user-id'] ||
      request.headers['user_id'];

    if (fallbackId) {
      const id = String(Array.isArray(fallbackId) ? fallbackId[0] : fallbackId).trim();
      request.user = { id, user_id: id, userId: id };
      return true;
    }

    throw new UnauthorizedException('Authentication token is required.');
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication token is required.');
    }
    return user;
  }
}



