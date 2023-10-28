import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Unique,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { CalendarEntity } from '../calendar/calendar.entity';

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

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToOne(() => CalendarEntity, (calendar) => calendar.user)
  calendar: CalendarEntity;
}
