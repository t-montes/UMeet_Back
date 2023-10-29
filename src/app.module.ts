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

@Module({
  imports: [
    UserModule,
    CalendarModule,
    EventModule,
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
        EventEntity /* TODO: Add all entities */,
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
