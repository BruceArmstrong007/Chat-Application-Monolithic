import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { socketIOAuthMiddleware } from '../middleware/ws-auth.middleware';
import { UserRepository } from 'apps/api/src/user/database/repository/user.repository';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      //cors,
    };

    const jwtService = this.app.get(JwtService);
    const config = this.app.get(ConfigService);
    const userRepo = this.app.get(UserRepository)
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('user').use(socketIOAuthMiddleware(jwtService, userRepo, this.logger, config));
    server.of('message').use(socketIOAuthMiddleware(jwtService, userRepo, this.logger, config));
    server.of('event').use(socketIOAuthMiddleware(jwtService, userRepo, this.logger, config));
    server.use(socketIOAuthMiddleware(jwtService, userRepo, this.logger, config));

    server.adapter();
    return server;
  }
}


