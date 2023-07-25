import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
