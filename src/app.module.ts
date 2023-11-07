import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/user.entity';
import { CalendarModule } from './calendar/calendar.module';
import { CalendarEntity } from './calendar/calendar.entity';
import { EventModule } from './event/event.module';
import { EventEntity } from './event/event.entity';
import { NotificationModule } from './notification/notification.module';
import { NotificationEntity } from './notification/notification.entity';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    UserModule,
    CalendarModule,
    EventModule,
    NotificationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'umeet',
      entities: [
        UserEntity,
        CalendarEntity,
        EventEntity,
        NotificationEntity /* TODO: Add all entities */,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
