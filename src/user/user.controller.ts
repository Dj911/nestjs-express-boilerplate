import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard, LocalAuthGuard } from '@auth/passport-strategy.guard'
import { Role } from '@helpers/constant';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { UserService } from '@user/user.service';
import { UserLoginBodyDto, UserSignupBodyDto } from '@user/dto/body.dto';

@Controller('user')
export class UserController {
    public Logger = new Logger(UserController.name)

    constructor(
        private UserService: UserService,
    ) {}
    
    @Post('login')
    @UseGuards(LocalAuthGuard)
    userLogin(@Req() req: Request,@Body() body: UserLoginBodyDto){
      this.Logger.log('USER LOGIN ROUTE',req.user)
      
      return this.UserService.login(body)
    }

    @Post('signup')
    userSignup(@Body() body: UserSignupBodyDto){
      this.Logger.log('USER LOGIN ROUTE')
      
      return this.UserService.signUp(body)
    }

    @Post('addUser')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.USER,Role.ADD_USER)
    addUser(@Body() body: UserSignupBodyDto){
      this.Logger.log('ADD USER ROUTE')
      
      return this.UserService.signUp(body)
    }
    
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: Request) {
      this.Logger.log('GET USER ROUTE',req.user)
      
      return this.UserService.getUserProfileById(req.user._id)
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get('profile/:id')
    @Roles(Role.VIEW_USER)
    getUserProfileById(@Param('id') id: string){
      this.Logger.log('GET USER ROUTE')

      return this.UserService.getUserProfileById(id)
    }

}
