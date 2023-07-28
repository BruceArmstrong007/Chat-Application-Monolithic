import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { LocalAuthStrategy } from './strategy/local-auth.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtService, JwtAuthStrategy, LocalAuthStrategy]
})
export class AuthModule {}
