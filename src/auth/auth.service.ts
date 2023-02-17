import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private JWTService: JwtService,
    ){}

    async generateToken(payload: any /* UserDTO */){
        return this.JWTService.sign(payload)
    }
}
