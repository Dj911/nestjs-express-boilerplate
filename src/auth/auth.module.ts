import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JWT } from 'src/helpers/constant';
import { UserSchema } from 'src/user/user.schema';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: JWT.SECRET,
      signOptions: {
        expiresIn: '1d'
      }
    })
  ],
  exports: [AuthService]
})
export class AuthModule {}
