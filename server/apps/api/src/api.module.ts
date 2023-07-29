import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_EXPIRATION: Joi.required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ContactModule
  ],
  controllers: [ApiController],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor
    // }
  ],
})
export class ApiModule { }
