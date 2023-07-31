import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {Socket} from 'socket.io';

export type SocketIOAuthMiddleware = {
    (client: Socket,next:(err ?: Error) => void);
  }
  
export const socketIOAuthMiddleware =
  (jwtService: JwtService, logger: Logger, config: ConfigService) : SocketIOAuthMiddleware =>
  (socket: Socket, next) => {
    
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];


    logger.debug(`Validating auth token before connection: ${token}`);
    try {
      const payload = jwtService.verify(token,{secret: config.get<string>('JWT_SECRET')});
      next();
    } catch (error){
      next(error);
    }
  };  