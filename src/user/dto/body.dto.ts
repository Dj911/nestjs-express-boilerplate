import { IsString } from "class-validator";

export class UserLoginBodyDto {
    @IsString()
    password: string;

    @IsString()
    username: string;
}

export class UserSignupBodyDto {
    @IsString()
    password: string;

    @IsString()
    username: string;

    @IsString()
    name: string;
}