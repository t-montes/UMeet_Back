import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CalendarEntity } from '../calendar/calendar.entity';

@Entity()
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  topic: string;

  @ManyToMany(() => UserEntity, (user) => user.groups)
  @JoinTable()
  members: UserEntity[];

  @ManyToOne(() => UserEntity, (user) => user.ownedGroups)
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @OneToOne(() => CalendarEntity, (calendar) => calendar.group)
  calendar: CalendarEntity;
}
