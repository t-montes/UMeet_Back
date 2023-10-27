import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/user.entity';
import { CalendarEntity } from '../../calendar/calendar.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [UserEntity, CalendarEntity /* TODO: Add all entities */],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    UserEntity,
    CalendarEntity /* TODO: Add all entities */,
  ]),
];
