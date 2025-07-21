import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTokenPayload } from '../type/auth.type';
import { Reflector } from '@nestjs/core';
import { PermissionsMetadataKey } from 'src/roles/decorator/permissions.decorator';
import { UserService } from 'src/user/user.service';
import { CreatePermissionDto } from 'src/roles/dto/role.dto';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccessTokenPayload;

    if (!user?.userId) {
      this.logger.warn('Authorization attempt without valid user');
      throw new HttpException(
        'Authentication required to access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const routePermissions: CreatePermissionDto[] =
      this.reflector.getAllAndOverride(PermissionsMetadataKey, [
        context.getHandler(),
        context.getClass(),
      ]);


    if (!routePermissions || routePermissions.length === 0) {
      this.logger.debug(
        `No permissions required for route: ${context.getHandler().name}`,
      );
      return true;
    }

    this.logger.debug(`Checking permissions for user ${user.userId}:`, {
      route: `${context.getClass().name}.${context.getHandler().name}`,
      requiredPermissions: routePermissions,
    });

    try {
      const userRoleData = await this.userService.getUserPermissions(
        user.userId,
      );
      const userPermissions = userRoleData.permissions;

      if (!userPermissions || userPermissions.length === 0) {
        this.logger.warn(`User ${user.userId} has no permissions assigned`);
        throw new HttpException(
          'Insufficient permissions to access this resource',
          HttpStatus.FORBIDDEN,
        );
      }

      for (const routePermission of routePermissions) {
        const hasPermission = this.checkPermission(
          routePermission,
          userPermissions,
        );

        if (!hasPermission) {
          this.logger.warn(`Permission denied for user ${user.userId}`, {
            required: routePermission,
            userPermissions: userPermissions.map((p) => ({
              resource: p.resource,
              actions: p.actions,
            })),
          });
          throw new HttpException(
            'Insufficient permissions to access this resource',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      this.logger.debug(`Authorization successful for user ${user.userId}`);
      return true;
    } catch (error) {
      // Re-throw HTTP exceptions as-is
      if (error instanceof HttpException) {
        throw error;
      }

      // Log unexpected errors and return generic error
      this.logger.error(`Authorization error for user ${user.userId}:`, error);
      throw new HttpException(
        'Authorization service temporarily unavailable',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check if user has the required permission for a specific resource
   * @param requiredPermission - The permission required by the route
   * @param userPermissions - The user's actual permissions
   * @returns true if user has the required permission, false otherwise
   */
  private checkPermission(
    requiredPermission: CreatePermissionDto,
    userPermissions: any[],
  ): boolean {
    // Find user's permission for the required resource
    const userPermission = userPermissions.find(
      (perm) => perm.resource === requiredPermission.resource,
    );

    // User doesn't have any permission for this resource
    if (!userPermission) {
      return false;
    }

    // Check if user has ALL required actions for this resource
    const hasAllActions = requiredPermission.actions.every((action) =>
      userPermission.actions.includes(action),
    );

    return hasAllActions;
  }
}

/**
 * Authorization Guard - Role-Based Access Control (RBAC) Implementation
 *
 * HOW THIS WORKS:
 *
 * 1. DECORATOR-BASED PERMISSION DEFINITION:
 *    - Routes are decorated with @Permissions([{ resource: 'users', actions: ['read', 'create'] }])
 *    - The decorator stores permission requirements as metadata on the route handler
 *
 * 2. PERMISSION STRUCTURE:
 *    - Resource: What the user wants to access (e.g., 'users', 'products', 'settings')
 *    - Actions: What operations are allowed (e.g., 'read', 'create', 'update', 'delete')
 *
 * 3. AUTHORIZATION FLOW:
 *    a) Extract user from JWT token (set by AuthenticationGuard)
 *    b) Get route permission requirements from decorator metadata
 *    c) Fetch user's permissions from their assigned role
 *    d) Compare route requirements with user permissions
 *    e) Allow/deny access based on permission match
 *
 * 4. PERMISSION MATCHING LOGIC:
 *    - User must have the SAME resource as required by the route
 *    - User must have ALL required actions for that resource
 *    - Example: Route requires ['read', 'create'] on 'users' resource
 *      User must have both 'read' AND 'create' actions for 'users' resource
 *
 * 5. ROLE HIERARCHY:
 *    - Users are assigned roles (e.g., 'admin', 'user', 'moderator')
 *    - Each role has a set of permissions
 *    - Permissions are stored as: { resource: 'users', actions: ['read', 'create'] }
 *
 * USAGE EXAMPLE:
 * @Controller('users')
 * @UseGuards(AuthenticationGuard, AuthorizationGuard)
 * export class UserController {
 *   @Get()
 *   @Permissions([{ resource: Resource.USERS, actions: [Action.READ] }])
 *   findAll() { ... }
 *
 *   @Post()
 *   @Permissions([{ resource: Resource.USERS, actions: [Action.CREATE] }])
 *   create() { ... }
 * }
 *
 * PERFORMANCE CONSIDERATIONS:
 * - getUserPermissions() is called on every request - consider caching
 * - Permission checking is O(n*m) where n=route permissions, m=user permissions
 * - For high-traffic apps, consider Redis caching with TTL
 *
 * SECURITY NOTES:
 * - Always use AuthenticationGuard before AuthorizationGuard
 * - This guard assumes user object is already validated and present
 * - Permission checks are strict - user must have ALL required actions
 */
