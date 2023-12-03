import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
      if (!requiredPermissions) {
          return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
 
      return requiredPermissions.every((perm) => {
          const [resource, action] = perm.split(':');
          return user.permissions[resource] && user.permissions[resource].includes(action);
      });
  }
  
}
