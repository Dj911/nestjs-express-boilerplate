import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PASSPORT_STRATEGIES } from 'src/helpers/constant';

@Injectable()
export class LocalAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.LOCAL){}

@Injectable()
export class JwtAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.JWT){}