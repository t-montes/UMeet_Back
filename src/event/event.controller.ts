import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Get, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDTO } from './event.dto';
import { EventEntity } from './event.entity';

@Controller('events')
@UseInterceptors(BusinessErrorsInterceptor)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':eventId')
  async getEvent(@Param('eventId') eventId: string) {
    return await this.eventService.get(eventId);
  }

  @Put(':eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() eventDTO: EventDTO,
  ) {
    return await this.eventService.update(
      eventId,
      plainToInstance(EventEntity, eventDTO),
    );
  }

  @Delete(':eventId')
  @HttpCode(204)
  async deleteEvent(@Param('eventId') eventId: string) {
    return await this.eventService.delete(eventId);
  }
}
