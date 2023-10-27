import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { CalendarEntity } from './calendar.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity, UserEntity])],
  providers: [CalendarService],
  controllers: [CalendarController],
})
export class CalendarModule {}
