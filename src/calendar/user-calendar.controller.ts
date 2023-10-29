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

@Controller('users/:userId/calendar')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserCalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getEvents(@Param('userId') userId: string) {
    return await this.calendarService.getEvents(true, userId);
  }

  @Post()
  @HttpCode(201)
  async createEvent(
    @Param('userId') userId: string,
    @Body() eventDTO: EventDTO,
  ) {
    return await this.calendarService.createEvent(
      true,
      userId,
      plainToInstance(EventEntity, eventDTO),
    );
  }

  @Put()
  async update(
    @Param('userId') userId: string,
    @Body() calendarDTO: CalendarDTO,
  ) {
    return await this.calendarService.update(
      true,
      userId,
      plainToInstance(CalendarEntity, calendarDTO),
    );
  }
}
