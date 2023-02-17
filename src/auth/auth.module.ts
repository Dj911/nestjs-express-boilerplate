import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JWT } from '@helpers/constant';
import { UserModule } from '@user/user.module';
import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/jwt.strategy';
import { LocalStrategy } from '@auth/local.strategy';

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
