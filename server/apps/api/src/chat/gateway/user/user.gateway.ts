import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from '../../chat.service';
import { SocketWithAuth } from '../../middleware/ws-auth.middleware';

@WebSocketGateway({ namespace: 'user' })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  // Initial Fetching of active online friends from redis periodically
  @SubscribeMessage('online-friends')
  async returnActiveUsers(client: SocketWithAuth): Promise<any> {
    return this.chatService.activeUsers(client?.userID);
  }

  // When user is connected, adds user online to redis db with time to live of 1 minute
  handleConnection(client: SocketWithAuth){
    this.chatService.addUserOnline(client.userID, client?.id);
    // this.chatService.connectUserChannels(client.userID, client);
  }

  // User will periodically adds them online to redis db with time to live of 1 minute
  @SubscribeMessage('online')
  async online(client: SocketWithAuth){
    this.chatService.addUserOnline(client.userID, client?.id);
  }

  // When user is disconnected, removes online user from redis 
  // And add user to a private room with each of his friends
  handleDisconnect(client: SocketWithAuth){
    this.chatService.removeUserOnline(client.userID);
  }









  


}
