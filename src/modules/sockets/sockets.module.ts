import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { EventsGateway } from './gateways/events.gateway';
import { EventsService } from './services/events.service';

@Module({
  providers: [EventsGateway, EventsService, SocketsService],
  exports: [EventsService],
})
export class SocketsModule {}
