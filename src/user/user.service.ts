import {
  BadRequestException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scryptSync } from 'crypto';
import { Model, PaginateModel } from 'mongoose';

import { AuthService } from '@auth/auth.service';
import { DB } from '@helpers/constant';
import { Messages } from '@helpers/messages';
import { UserLoginBodyDto, UserSignupBodyDto } from '@user/dto/body.dto';
import {
  UserResponseDto,
  UserSignUpAndLoginResponseDto,
} from '@user/dto/response.dto';
import { IUser } from '@user/user.schema';
import { Socket } from 'socket.io';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class UserService {
  public Logger = new Logger(UserService.name);

  constructor(
    @InjectModel(DB.USER) private readonly User: PaginateModel<IUser>,
    private AuthService: AuthService,
    private socket: EventsGateway,
  ) {}

  async signUp(
    payload: UserSignupBodyDto,
  ): Promise<UserSignUpAndLoginResponseDto> {
    this.Logger.log('Inside user signUp service');

    const { password, username } = payload;

    const check = await this.User.findOne({ username }).lean();

    if (check) throw new NotFoundException(Messages.USER_EXIST);

    const salt = randomBytes(8).toString('hex');

    const hash = scryptSync(password, salt, 32);

    const res = salt + '.' + hash.toString('hex');

    payload.password = res;

    await this.User.create(payload);

    this.socket.server.emit(
      'emit-message',
      await this.getAllUsers({
        perPage: 2,
        page: 1,
        sort: 1,
      }),
    );

    const resObj: UserSignUpAndLoginResponseDto = {
      message: Messages.USER_SIGNUP_SUCCESS,
    };

    return resObj;
  }

  async login(
    payload: UserLoginBodyDto,
  ): Promise<UserSignUpAndLoginResponseDto> {
    this.Logger.log('Inside login service');

    const { password, username } = payload;

    const check = await this.User.findOne({
      username,
    }).lean();

    const [salt, storedHash] = check.password.split('.');

    const hash = scryptSync(password, salt, 32);

    if (hash.toString('hex') !== storedHash)
      throw new BadRequestException(Messages.USER_LOGIN_FAILED);

    if (!check) throw new BadRequestException(Messages.USER_LOGIN_FAILED);

    delete check.password;
    const token = await this.AuthService.generateToken(check);

    let resObj: UserSignUpAndLoginResponseDto = {
      message: Messages.USER_LOGIN_SUCCESS,
      token,
    };

    return resObj;
  }

  async validateUser(userName: string, password: string) {
    this.Logger.log('Inside validate user service');

    const user = await this.User.findOne({ username: userName }).lean();

    const [salt, storedHash] = user.password.split('.');

    const hash = scryptSync(password, salt, 32);

    const inputHash = hash.toString('hex');

    if (inputHash === storedHash) {
      const { password, ...rest } = user;

      return rest;
    }

    return null;
  }

  async getUserProfileById(id: string): Promise<UserResponseDto> {
    this.Logger.log('Inside get user profile by id service');

    const user = await this.User.findById(id).lean();

    if (!user) throw new NotFoundException(Messages.USER_NOT_FOUND);

    const { password, ...resObj } = user;
    return resObj;
  }

  async getAllUsers(queryParams) {
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;
    const options = {
      page: page,
      limit: limit,
      sort: { createdAt: -1 },
    };
    const result = await this.User.paginate({}, options);

    return result;
  }
}
