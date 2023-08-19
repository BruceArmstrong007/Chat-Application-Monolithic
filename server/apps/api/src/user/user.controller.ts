import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SearchUserRequest } from './dto/request/user.request';
import { UpdateUserRequest } from './dto/request/user.request';
import { User } from './database/model/user.model';
import { CurrentUser } from '@app/common';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async profile(@CurrentUser() user: User) {
    return await this.userService.profile(user?.username);
  }


  @Post('search')
  async searchUser(
    @CurrentUser() user: User,
    @Body() request: SearchUserRequest,
  ) {
    return await this.userService.getUsers(user?.username, request?.search);
  }

  @Put('update')
  async updateUser(
    @CurrentUser() user: User,
    @Body() request: UpdateUserRequest,
  ) {
    return await this.userService.updateUser(user?.username, request);
  }

  @Post('delete')
  async deleteUser(@CurrentUser() user: User) {
    return await this.userService.deleteUser(user?.username);
  }

}
