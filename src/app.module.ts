import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { Cron, CronExpression, ScheduleModule } from '@nestjs/schedule';
import { IoAdapter } from '@nestjs/platform-socket.io';
// import {WebS} from '@nestjs/websockets'

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
// import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ScheduleModule.forRoot(),
    /* IoAdapter.forRoot({
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    }), */

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      // To use custom multiple configurations
      // load: [configuration],
    }),
    MongooseModule.forRoot(
      process.env.DB_SRV,
      /* {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // config.get is equal to process.env of dotenv
        uri: config.get('DB_SRV'),
        connectionFactory: (connection)=>{
          connection.on('connected', () => {
            new Logger().log('Mongoose connection open to master DB');
        })
        }
      }),
    } */
    ),
    /*
     * Uncomment this to use the Default Web Socket of NestJs
     */
    // EventsModule,
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  /* @Cron(CronExpression.EVERY_5_SECONDS)
  minuteCron() {
    console.log('This will be called every 5 seconds');
  } */
}
