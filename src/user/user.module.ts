import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { CalendarEntity } from 'src/calendar/calendar.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, CalendarEntity])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
