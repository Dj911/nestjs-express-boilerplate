import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from '@user/user.schema';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { AuthModule } from '@auth/auth.module';
import { DB } from '../helpers/constant';
import { EventsGateway } from '../events/events.gateway';

@Module({
  providers: [UserService, EventsGateway],
  imports: [
    MongooseModule.forFeature([{ name: DB.USER, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(private UserService: UserService) {}

  async onModuleInit() {
    // This function will be called immediately once the User Module is first initialized
    // So if we want to create a default user when the server is started then just call the service as below
    // await this.UserService.createDefaultAdmin();
  }
}
