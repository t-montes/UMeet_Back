import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { UserCalendarController } from './user-calendar.controller';
import { GroupCalendarController } from './group-calendar.controller';
import { CalendarEntity } from './calendar.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity, UserEntity])],
  providers: [CalendarService],
  controllers: [UserCalendarController, GroupCalendarController],
})
export class CalendarModule {}
