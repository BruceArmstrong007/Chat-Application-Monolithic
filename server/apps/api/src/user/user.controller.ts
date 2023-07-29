import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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


  @Post('search')
  async searchUser(@Body() request: SearchUserRequest) {
    return this.userService.getUsers(request?.search);
  }

  @Post('update')
  async updateUser(
    @CurrentUser() user: User,
    @Body() request: UpdateUserRequest,
  ) {
    return this.userService.updateUser(user?.username, request);
  }
}
