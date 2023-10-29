import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsHexColor } from 'class-validator';
import { UserEntity } from '../user/user.entity';
// import { GroupEntity } from '../group/group.entity';
import { EventEntity } from '../event/event.entity';

@Entity()
export class CalendarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '#ffffff' })
  @IsHexColor()
  color: string;

  @OneToOne(() => UserEntity, (user) => user.calendar, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  /* @OneToOne(() => GroupEntity, (group) => group.calendar)
  @JoinColumn()
  group: GroupEntity; */

  @OneToMany(() => EventEntity, (event) => event.calendar)
  events: EventEntity[];
}
