import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

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
