import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { CalendarEntity } from '../calendar/calendar.entity';
import { SettingsEntity } from 'src/settings/settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CalendarEntity, SettingsEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
