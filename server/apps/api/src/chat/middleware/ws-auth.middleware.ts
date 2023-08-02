import { Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {Socket} from 'socket.io';
import { UserRepository } from "../../user/database/repository/user.repository";

export type AuthPayload = {
  userID: string;
}

export type SocketWithAuth = Socket & AuthPayload ;

export type SocketIOAuthMiddleware = {
    (client: SocketWithAuth,next:(err ?: Error) => void);
  }
  
export const socketIOAuthMiddleware =
   (jwtService: JwtService, userRepo: UserRepository, logger: Logger, config: ConfigService) : SocketIOAuthMiddleware =>
  (socket: SocketWithAuth, next) => {
   const handleSocketConnection = async (socket: SocketWithAuth,next) =>{
    
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    // logger.debug(`Validating auth token before connection: ${token}`);
    
    try {
      const payload = jwtService.verify(token,{secret: config.get<string>('JWT_SECRET')});
      const objectID = (await userRepo.findByUsername(payload?.username)).toJSON()._id;
      if(!objectID){
        throw new UnauthorizedException();
      }
      console.log(payload)
      socket.userID =  objectID.toString();
      next();
    } catch (error){
      next(error);
    }
   }

   handleSocketConnection(socket,next);
  };  