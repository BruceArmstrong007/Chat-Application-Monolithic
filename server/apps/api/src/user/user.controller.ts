import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/request/create-user.request';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() request: CreateUserRequest) {
    return this.userService.createUser(request);
  }

}
