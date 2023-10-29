import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventEntity } from './event.entity';
import { CalendarEntity } from '../calendar/calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity, EventEntity])],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
