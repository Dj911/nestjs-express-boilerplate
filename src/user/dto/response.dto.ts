import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { Schema } from 'mongoose';
import { Role } from 'src/helpers/constant';

export class UserResponseDto {
    @IsString()
    _id: Schema.Types.ObjectId;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    username: string;

    @IsEnum(Role)
    roles: string

    @IsDateString()
    @IsOptional()
    createdAt?: Date

    @IsDateString()
    @IsOptional()
    updatedAt?: Date
}

export class UserSignUpAndLoginResponseDto {
    @IsString()
    message: string;

    @IsString()
    @IsOptional()
    token?: string
}