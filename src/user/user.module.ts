import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from '@user/user.schema';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { AuthModule } from '@auth/auth.module';

@Module({
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{name: 'UserTest', schema: UserSchema}]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}