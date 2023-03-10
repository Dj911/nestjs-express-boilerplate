import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
// import { Server } from 'ws';
import { UserService } from '../user/user.service';
import { Server, Socket } from 'socket.io';
import { IUser } from '../user/user.schema';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DB } from '../helpers/constant';
('socket.io');

// Here 5000 is the port for socket, if you change this then please change this inside the client.socket.html file too
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(DB.USER) private readonly User: PaginateModel<IUser>,
  ) /* private UserService: UserService */ {}

  @SubscribeMessage('events')
  onEvent(client: Socket, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    Logger.log('Handle Message Gateway');

    /* client.emit(
      'emit-message',
      await this.UserService.getAllUsers({
        perPage: 2,
        page: 1,
        sort: 1,
      }),
    ); */

    // return await this.UserService.getAllUsers({
    //   perPage: 2,
    //   page: 1,
    //   sort: 1,
    // });
  }

  async afterInit(server: Server) {
    Logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    Logger.log(`Client connected: ${client.id}`);
  }
}
