import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Unique,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { IsEmail, Matches } from 'class-validator';
import { CalendarEntity } from '../calendar/calendar.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { SettingsEntity } from '../settings/settings.entity';
import { GroupEntity } from '../group/group.entity';

@Entity()
@Unique('unique-login', ['login'])
@Unique('unique-email', ['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  login: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must have at least one uppercase, lowercase and number or special character',
  })
  password: string;

  @OneToOne(() => CalendarEntity, (calendar) => calendar.user)
  calendar: CalendarEntity;

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => GroupEntity, (group) => group.owner)
  ownedGroups: GroupEntity[];

  @ManyToMany(() => GroupEntity, (group) => group.members)
  groups: GroupEntity[];

  @OneToOne(() => SettingsEntity, (settings) => settings.user)
  settings: SettingsEntity;

  @ManyToMany(() => UserEntity, (user) => user.friends)
  @JoinTable()
  friends: UserEntity[];
}
