import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PASSPORT_STRATEGIES } from '@helpers/constant';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LocalAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.LOCAL){}

@Injectable()
export class JwtAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.JWT){
    constructor(private readonly reflector: Reflector) {
        super();
      }
    
      canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get<boolean>(
          'isPublic',
          context.getHandler()
        );
        console.log("ASGS");
        
    
        if (isPublic) {
          return true;
        }
    
        return super.canActivate(context);
    }
}