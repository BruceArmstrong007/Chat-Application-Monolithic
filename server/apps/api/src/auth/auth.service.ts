import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user/database/model/user.model';

export interface TokenPayload {
    userId: string;
  }
  

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
      ) {}
    
      async login(user: User, response: Response) {
        const payload = {
          username: user.username,
          sub: {
            name: user.name,
          },
        };
    
        const expires = new Date();
        expires.setSeconds(
          expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
        );
    
        const accessToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn: this.configService.get('JWT_EXPIRATION')+'s'});
        const refreshToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn:'7d'});

        response.cookie('Authentication', accessToken, {
          httpOnly: true,
          expires,
        });

        await response.send({refreshToken,...user.toJSON()});
      }

      async refreshToken(user: User, response: Response) {
        const payload = {
          username: user.username,
          sub: {
            name: user.name,
          },
        };
    
        const expires = new Date();
        expires.setSeconds(
          expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
        );
    
        const accessToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn: this.configService.get('JWT_EXPIRATION')+'s'});
        const refreshToken = await this.jwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET'),expiresIn:'7d'});

        response.cookie('Authentication', accessToken, {
          httpOnly: true,
          expires,
        });
        
        await response.send({refreshToken,...user.toJSON()});
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
