import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {Socket} from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  @SubscribeMessage('sendNotification')
  sendNotification(@ConnectedSocket() client: Socket, payload: { userId: string, message: string }) {
    const { userId, message } = payload;
    const socketId = this.getSocketIdByUserId(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', message);
    }
  }

  
To send real-time notifications to users using Socket.IO in NestJS, you can follow these steps:

Set up the Socket.IO Gateway: If you haven't already, create a Socket.IO gateway using the following command:
bash
Copy code
$ nest g gateway socket
Handle Connections: In your Socket.IO gateway (e.g., socket.gateway.ts), implement the handleConnection and handleDisconnect methods to handle client connections and disconnections, just like in the previous example.

Implement Notification Event: Define a custom event for sending notifications to users. For example, you can create a sendNotification event that clients can listen to in order to receive notifications.

Here's an example of how to do this:

typescript
Copy code
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private connectedUsers = new Map<string, string>();

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.connectedUsers.set(client.id, userId);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.connectedUsers.delete(client.id);
  }

  
  // Custom event for sending notifications to users
  @SubscribeMessage('sendNotification')
  sendNotification(@ConnectedSocket() client: Socket, payload: { userId: string, message: string }) {
    const { userId, message } = payload;
    const socketId = this.getSocketIdByUserId(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', message);
    }
  }

  // Helper function to retrieve socket ID based on user ID
  private getSocketIdByUserId(userId: string): string | undefined {
    for (const [socketId, connectedUserId] of this.connectedUsers.entries()) {
      if (connectedUserId === userId) {
        return socketId;
      }
    }
    return undefined;
  }

}
