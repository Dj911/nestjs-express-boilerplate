import { SetMetadata } from '@nestjs/common';
import { Role } from '../helpers/constant';

// This should always be included in the request body
export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);