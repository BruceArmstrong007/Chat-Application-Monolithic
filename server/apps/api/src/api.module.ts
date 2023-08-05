import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongoDBModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        REDIS_URI: Joi.string().required(),
        REDIS_PORT: Joi.required(),
        REDIS_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.required()
      }),
    }),
    MongoDBModule,
    AuthModule,
    UserModule,
    ContactModule,
    ChatModule
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule { }
