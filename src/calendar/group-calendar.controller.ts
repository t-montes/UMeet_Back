import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Put, Param, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarDTO } from './calendar.dto';
import { CalendarEntity } from './calendar.entity';

@Controller('groups/:groupId/calendar')
@UseInterceptors(BusinessErrorsInterceptor)
export class GroupCalendarController {
  constructor(private readonly calendarService: CalendarService) {}

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
