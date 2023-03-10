import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UserService } from '../user/user.service';
import { UserSchema } from '../user/user.schema';
import { DB } from '../helpers/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [EventsGateway, UserService],
  imports: [
    MongooseModule.forFeature([{ name: DB.USER, schema: UserSchema }]),
    AuthModule,
  ],
  exports: [EventsGateway],
})
export class EventsModule {}
