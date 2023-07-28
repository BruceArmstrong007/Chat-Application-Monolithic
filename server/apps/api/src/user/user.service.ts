import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

import { CreateUserRequest } from './dto/request/create-user.request';
import { User } from './database/model/user.model';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './database/repository/user.repository';
import { SearchUserRequest } from './dto/request/search-user.request';
import { UpdateUserRequest } from './dto/request/update-user.request';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
    
    async createUser(request: CreateUserRequest) {
        await this.validateCreateUserRequest(request);
        const { password, ...user} = await this.userRepository.create({
            ...request,
            password: await bcrypt.hash(request.password, 10),
            name: '',
            profileURL: '',
            contacts: [],
            sentRequests: [],
            receivedRequests: [],
            bio: ''
        });
        return user;
    }


    private async validateCreateUserRequest(request: CreateUserRequest) {
        let user: User;
        try {
            user = await this.userRepository.findOne({
                username: request.username,
            });
        } catch (err) { }

        if (user) {
            throw new UnprocessableEntityException('User already exists.');
        }
    }

    async validateUser(username: string, password: string) {
        const user = await this.userRepository.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
          }
          return null;
    }


    async getUsers(searchTerm: string) {
    const regexPattern = new RegExp(searchTerm, 'i');
        return await this.userRepository.find({ username: regexPattern },'username name profileURL bio');
    }

    async updateUser(username: string,fields : UpdateUserRequest){
        const {password,...user} = await this.userRepository.findOneAndUpdate({ username : username},fields);
        return user;
    }

}
