import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role, RoleHierarchy } from "../enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('User not authenticated');

    const userRoleWeight = RoleHierarchy[user.role as Role] || 0;
    const minRequiredWeight = Math.min(...requiredRoles.map((r) => RoleHierarchy[r] || 0));

    if (userRoleWeight < minRequiredWeight) {
      throw new ForbiddenException('You do not have permission');
    }
    return true;
  }
}
