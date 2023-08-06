import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user/database/model/user.model';


@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
      ) {}
    
      async login(user: User) {
        const payload = {
          username: user.username,
          sub: {
            name: user.name,
          },
        };

    
        const accessToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn: this.configService.get('JWT_EXPIRATION')+'s'});
        const refreshToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn:'7d'});

        await response.send({refreshToken,accessToken});
      }
      
      async refreshToken(user: User) {
        const payload = {
          username: user.username,
          sub: {
            name: user.name,
          },
        };
    
        const accessToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn: this.configService.get('JWT_EXPIRATION')+'s'});
        // const refreshToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn:'7d'});
        
        await response.send({accessToken});
      }

     async logout(response: Response) {
        response.cookie('Authentication', '', {
          httpOnly: true,
          expires: new Date(),
        });

        await response.send({
          "message": "Logout successful"
        });
      }
}
