import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import configuration from '@config/configuration';

@Module({
  imports: [
    UserModule,
    AuthModule,
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
    MongooseModule.forRoot(process.env.DB_SRV,
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
    } */),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
