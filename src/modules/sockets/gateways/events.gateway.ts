import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { EventsService } from '../services/events.service';
import { JoinEventDto } from '../dtos/join-event.dto';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly eventsService: EventsService) {}

  handleConnection(socket: Socket) {
    console.log(`Cliente conectado: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Cliente desconectado: ${socket.id}`);
  }

  @SubscribeMessage('joinEvent')
  handleJoinEvent(
    @MessageBody() data: JoinEventDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(data.eventId);
    console.log(`Usuario ${socket.id} se unió al evento ${data.eventId}`);

    // Opcional: Enviar un mensaje de confirmación al usuario
    socket.emit('joinedEvent', {
      message: `Te uniste al evento ${data.eventId}`,
    });
  }

  @SubscribeMessage('leaveEvent')
  handleLeaveEvent(
    @MessageBody() data: JoinEventDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(data.eventId);
    console.log(`Usuario ${socket.id} salió del evento ${data.eventId}`);

    // Opcional: Enviar un mensaje de confirmación al usuario
    socket.emit('leftEvent', {
      message: `Saliste del evento ${data.eventId}`,
    });
  }

  @SubscribeMessage('getEventUpdates')
  async handleEventUpdates(
    @MessageBody() data: JoinEventDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const update = this.eventsService.getLiveEventUpdates(data.eventId);
    this.server.to(data.eventId).emit('eventUpdate', update);
  }
}
