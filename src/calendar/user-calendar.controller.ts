import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Put, Param, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarDTO } from './calendar.dto';
import { CalendarEntity } from './calendar.entity';

@Controller('users/:userId/calendar')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserCalendarController {
  constructor(private readonly calendarService: CalendarService) {}

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
