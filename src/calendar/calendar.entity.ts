import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class CalendarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // color with a default value
  @Column({ default: '#ffffff' })
  color: string;

  @OneToOne(() => UserEntity, (user) => user.calendar)
  @JoinColumn()
  user: UserEntity;
}
