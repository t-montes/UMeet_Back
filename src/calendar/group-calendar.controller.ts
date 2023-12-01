import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Get, Post, Put, Param, Body, HttpCode } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarDTO } from './calendar.dto';
import { CalendarEntity } from './calendar.entity';
import { EventDTO } from '../event/event.dto';
import { EventEntity } from '../event/event.entity';

@Controller('groups/:groupId/calendar')
@UseInterceptors(BusinessErrorsInterceptor)
export class GroupCalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getEvents(@Param('groupId') groupId: string) {
    return await this.calendarService.getEvents(false, groupId);
  }

  @Post()
  @HttpCode(201)
  async createEvent(
    @Param('groupId') groupId: string,
    @Body() eventDTO: EventDTO,
  ) {
    return await this.calendarService.createEvent(
      true,
      groupId,
      plainToInstance(EventEntity, eventDTO),
    );
  }

  @Put()
  async update(
    @Param('groupId') groupId: string,
    @Body() calendarDTO: CalendarDTO,
  ) {
    return await this.calendarService.update(
      false,
      groupId,
      plainToInstance(CalendarEntity, calendarDTO),
    );
  }
}
