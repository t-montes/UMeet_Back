import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/user.entity';
// import { GroupEntity } from '../../group/group.entity';
import { CalendarEntity } from '../../calendar/calendar.entity';
import { EventEntity } from '../../event/event.entity';
import { NotificationEntity } from '../../notification/notification.entity';
import { GroupEntity } from '../../group/group.entity';
import { SettingsEntity } from '../../settings/settings.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      UserEntity,
      CalendarEntity,
      EventEntity,
      NotificationEntity,
      GroupEntity /* TODO: Add all entities */,
      SettingsEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    UserEntity,
    CalendarEntity,
    EventEntity,
    NotificationEntity,
    GroupEntity /* TODO: Add all entities */,
    SettingsEntity,
  ]),
];
