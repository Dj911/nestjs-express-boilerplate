import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard, LocalAuthGuard } from '@auth/passport-strategy.guard'
import { Role } from '@helpers/constant';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { UserService } from '@user/user.service';
import { UserLoginBodyDto, UserSignupBodyDto } from '@user/dto/body.dto';
import { UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../validations/joi.validate';
import { login_schema, signup_schema } from '../validations/joi.schema';
import { Public } from '../decorators/public.decorator';

@Controller('user')
@UseGuards(RolesGuard)
@Roles(Role.PUBLIC)
export class UserController {
    public Logger = new Logger(UserController.name)

    constructor(
        private UserService: UserService,
    ) {}
    
    @Post('login')
    @Public()
    @UsePipes(new JoiValidationPipe(login_schema))
    @UseGuards(LocalAuthGuard)
    userLogin(@Req() req: Request,@Body() body: UserLoginBodyDto){
      this.Logger.log('USER LOGIN ROUTE')
      
      return this.UserService.login(body)
    }

    @Post('signup')
    @Public()
    @UsePipes(new JoiValidationPipe(signup_schema))
    userSignup(@Body() body: UserSignupBodyDto){
      this.Logger.log('USER LOGIN ROUTE')
      
      return this.UserService.signUp(body)
    }

    @Post('addUser')
    @UseGuards(RolesGuard)
    @Roles(Role.USER,Role.ADD_USER)
    addUser(@Body() body: UserSignupBodyDto){
      this.Logger.log('ADD USER ROUTE')
      
      return this.UserService.signUp(body)
    }
    
    @Get('profile')
    getProfile(@Req() req: Request) {
      this.Logger.log('GET USER ROUTE')
      
      return this.UserService.getUserProfileById(req.user._id)
    }

    @UseGuards(RolesGuard)
    @Get('profile/:id')
    @Roles(Role.VIEW_USER)
    getUserProfileById(@Param('id') id: string){
      this.Logger.log('GET USER ROUTE')

      return this.UserService.getUserProfileById(id)
    }

}
