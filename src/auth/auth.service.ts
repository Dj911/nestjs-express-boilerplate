import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB } from 'src/helpers/constant';
import { IUser } from 'src/user/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private JWTService: JwtService,
    ){}

    async generateToken(payload: any /* UserDTO */){
        return this.JWTService.sign(payload)
    }
}
