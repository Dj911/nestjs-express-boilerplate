import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@helpers/constant';
import { ROLES_KEY } from '@decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean { 
    
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.includes(Role.PUBLIC)) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request || {}
    
    const admin = user?.roles?.includes(Role.ADMIN)

    
    return admin ? true : requiredRoles.every((role) => user?.roles?.includes(role));
  }
}