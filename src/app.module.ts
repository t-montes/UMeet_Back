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
import { GroupEntity } from './group/group.entity';
import { SettingsModule } from './settings/settings.module';
import { SettingsEntity } from './settings/settings.entity';
import { PersonModule } from './person/person.module';
import { AuthModule } from './auth/auth.module';
import { GroupUserModule } from './group-user/group-user.module';

@Module({
  imports: [
    UserModule,
    CalendarModule,
    EventModule,
    GroupModule,
    NotificationModule,
    SettingsModule,
    PersonModule,
    AuthModule,
    GroupUserModule,
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
        NotificationEntity,
        GroupEntity,
        SettingsEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
