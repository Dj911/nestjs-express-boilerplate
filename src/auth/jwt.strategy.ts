import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import {ExtractJwt, Strategy } from 'passport-jwt'
import { JWT } from "src/helpers/constant"

@Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT.SECRET,
        })
    }

    async validate(payload: any){
        const {_id, username, name, roles} = payload
        
        return {_id, username, name, roles}
    }
  }