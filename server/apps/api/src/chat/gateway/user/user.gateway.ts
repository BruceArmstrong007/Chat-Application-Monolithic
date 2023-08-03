import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from '../../chat.service';

@WebSocketGateway({namespace:'user'})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @SubscribeMessage('activeFriends')
  async returnActiveUsers(client: any): Promise<any> {
    return this.chatService.activeUsers(client?.userID);
  }

  handleConnection(client: any){
    this.chatService.addUserOnline(client.userID);
  }

  handleDisconnect(client: any){
    this.chatService.removeUserOnline(client.userID);
  }

  


}
