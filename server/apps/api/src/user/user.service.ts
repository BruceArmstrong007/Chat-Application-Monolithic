import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  CreateUserRequest,
  UpdateUserRequest,
} from './dto/request/user.request';
import { User } from './database/model/user.model';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './database/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
    
    async createUser(request: CreateUserRequest) {
        await this.validateCreateUserRequest(request);
        const user = await this.userRepository.createUser(request?.username,await bcrypt.hash(request.password, 10));
        return user;
    }


    private async validateCreateUserRequest(request: CreateUserRequest) {
        let user: User;
        try {
            user = await this.userRepository.findByUsername(request?.username);
        } catch (err) { }

        if (user) {
            throw new UnprocessableEntityException('User already exists.');
        }
    }

    async validateUser(username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
          }
          return null;
    }


    async getUsers(searchTerm: string) {
        const user = await this.userRepository.searchUsers(searchTerm,'username name profileURL bio');
        return user;
    }

    async updateUser(username: string,fields : UpdateUserRequest){
        return await this.userRepository.updateUser(username,fields);
    }

}
