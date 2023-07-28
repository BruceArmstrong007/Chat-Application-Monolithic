import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(private configService: ConfigService){
        console.log('JWT - ', configService.get<string>('JWT_SECRET'));
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') 
        });
    }

    async validate(payload: any){
        return { user : payload.sub, username : payload.username };
        
    }

} 