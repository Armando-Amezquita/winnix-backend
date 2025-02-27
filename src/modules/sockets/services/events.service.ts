import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  private liveEvents: Record<string, any[]> = {}; // Almacena eventos en vivo por ID

  joinEvent(eventId: string, userId: string) {
    if (!this.liveEvents[eventId]) {
      this.liveEvents[eventId] = [];
    }
    this.liveEvents[eventId].push(userId);
    return { message: `User ${userId} joined event ${eventId}` };
  }

  leaveEvent(eventId: string, userId: string) {
    if (this.liveEvents[eventId]) {
      this.liveEvents[eventId] = this.liveEvents[eventId].filter(
        (id) => id !== userId,
      );
    }
    return { message: `User ${userId} left event ${eventId}` };
  }

  getLiveEventUpdates(eventId: string) {
    // Aquí podrías conectar con una fuente de datos en tiempo real
    return { eventId, update: 'Nuevo gol anotado!' };
  }
}
