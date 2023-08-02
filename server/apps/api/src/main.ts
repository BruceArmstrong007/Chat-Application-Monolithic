import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './chat/adapter/socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    }));
  const configService = app.get(ConfigService);



  app.useWebSocketAdapter(new SocketIOAdapter(app, configService))
  await app.listen(configService.get('PORT'));

}
bootstrap();
