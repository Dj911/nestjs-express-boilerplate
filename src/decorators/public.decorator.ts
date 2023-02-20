import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE } from '../helpers/constant';

export const Public = () => SetMetadata(PUBLIC_ROUTE, true);