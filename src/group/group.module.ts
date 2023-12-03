import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { GroupController } from './group.controller';
import { CalendarEntity } from '../calendar/calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, CalendarEntity])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
