import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/database/model/user.model';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Response } from 'express';
import { CreateUserRequest } from '../user/dto/request/create-user.request';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshJwtGuard } from './guard/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,private readonly userService: UserService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
     @CurrentUser() user: User,
     @Res({ passthrough: true }) response: Response){
        return await this.authService.login(user, response);
    }

    @Post('register')
    async registerUser(@Body() request: CreateUserRequest) {
      return await this.userService.createUser(request);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshUser(@CurrentUser() user: User,
      @Res({ passthrough: true }) response: Response){
      return await this.authService.refreshToken(user, response);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logoutUser(
      @CurrentUser() user: User,@Res({ passthrough: true }) response: Response) {
      return this.authService.logout(response);
    }
}
