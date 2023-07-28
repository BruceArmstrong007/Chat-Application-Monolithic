import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule { }
