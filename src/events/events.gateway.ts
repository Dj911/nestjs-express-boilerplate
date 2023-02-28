import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server } from 'ws';
import { UserService } from '../user/user.service';

// Here 5000 is the port for socket, if you change this then please change this inside the client.socket.html file too
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private UserService: UserService) {}

  @SubscribeMessage('events')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    return this.UserService.getAllUsers({
      perPage: 2,
      page: 1,
      sort: 1,
      // sortBy: 'total_cost',
    });
  }
}
