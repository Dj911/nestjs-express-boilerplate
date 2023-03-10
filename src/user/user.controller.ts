import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  Session,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard, LocalAuthGuard } from '@auth/passport-strategy.guard';
import { Role } from '@helpers/constant';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { UserService } from '@user/user.service';
import { UserLoginBodyDto, UserSignupBodyDto } from '@user/dto/body.dto';
import { UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../validations/joi.validate';
import { login_schema, signup_schema } from '../validations/joi.schema';
import { Public } from '../decorators/public.decorator';
import { shopify } from '../config/shopify';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { diskStorage, memoryStorage } from 'multer';

@Controller('user')
@UseGuards(RolesGuard)
@Roles(Role.PUBLIC)
export class UserController {
  public Logger = new Logger(UserController.name);

  constructor(private UserService: UserService) {}

  @Post('login')
  @Public()
  @UsePipes(new JoiValidationPipe(login_schema))
  @UseGuards(LocalAuthGuard)
  userLogin(@Req() req: Request, @Body() body: UserLoginBodyDto) {
    this.Logger.log('USER LOGIN ROUTE');

    return this.UserService.login(body);
  }

  @Post('signup')
  @Public()
  @UsePipes(new JoiValidationPipe(signup_schema))
  userSignup(@Body() body: UserSignupBodyDto) {
    this.Logger.log('USER LOGIN ROUTE');

    return this.UserService.signUp(body);
  }

  @Post('addUser')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADD_USER)
  addUser(@Body() body: UserSignupBodyDto) {
    this.Logger.log('ADD USER ROUTE');

    return this.UserService.signUp(body);
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    this.Logger.log('GET USER ROUTE');

    return this.UserService.getUserProfileById(req.user._id);
  }

  @Get('all-profile')
  @Public()
  getAllProfile(@Req() req: Request) {
    this.Logger.log('GET USER ROUTE');

    return this.UserService.getAllUsers(req.query);
  }

  @UseGuards(RolesGuard)
  @Get('profile/:id')
  @Roles(Role.VIEW_USER)
  getUserProfileById(@Param('id') id: string) {
    this.Logger.log('GET USER ROUTE');

    return this.UserService.getUserProfileById(id);
  }

  @Get('/auth')
  @Public()
  async auth(@Req() req: Request, @Res() res: Response, @Query() query) {
    this.Logger.log('GET AUTH ROUTE');

    await shopify.auth.begin({
      shop: shopify.utils.sanitizeShop(query.shop, true),
      callbackPath:
        'https://01cf-14-102-161-106.in.ngrok.io/user/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  }

  @Get('/auth/callback')
  @Public()
  async authCallBack(@Req() req: Request, @Res() res: Response) {
    this.Logger.log('GET AUTH CALLBACK ROUTE');

    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // You can now use callback.session to make API requests

    const data = await shopify.rest.Order.all({
      session: callback.session,
      status: 'any',
    });

    // return data

    res.redirect('/my-apps-entry-page');
  }

  // @UseGuards(RolesGuard)
  @Get('test')
  @Public()
  // @Roles(Role.VIEW_USER)
  async test(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query,
    @Session() ses,
  ) {
    this.Logger.log('GET USER ROUTE');

    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    // use sessionId to retrieve session from app's session storage
    // getSessionFromStorage() must be provided by application
    const session = await ses(sessionId);

    const data = await shopify.rest.Order.all({
      session: session,
      status: 'any',
    });

    return data;
  }

  @Public()
  @Post('uploadProfileImage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          '/media/bytes-dharmaraj/workspace/projects/Sandbox/nestjs boilerplate/nest-boilerplate/files',
        filename: function (req, file, cb) {
          const name = file.originalname.split('.');
          cb(null, Date.now() + '.' + name[1]);
        },
      }),
    }),
  )
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Use this for validation of file upload
          // new MaxFileSizeValidator({ maxSize: 100 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res() res: Response,
  ) {
    // In order to send file in response we need to set the Content-type header as per the file
    // and send the file as an attachment. Then we can send the file as buffer
    res.setHeader(
      'Content-Type',
      file.mimetype /* 'application/octet-stream' */,
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.originalname}`,
    );

    res.sendFile(file.filename, {
      root: `/media/bytes-dharmaraj/workspace/projects/Sandbox/nestjs boilerplate/nest-boilerplate/files`,
    });
  }

  @Get('profileImage/:img')
  @Public()
  async getProfileImage(@Param('img') imgPath: string, @Res() res: Response) {
    res.sendFile(imgPath, {
      root: `/media/bytes-dharmaraj/workspace/projects/Sandbox/nestjs boilerplate/nest-boilerplate/files`,
    });
  }
}
