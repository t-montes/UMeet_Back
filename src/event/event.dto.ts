/**
 * /**
 * import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsUrl, IsHexColor } from 'class-validator';
import { CalendarEntity } from '../calendar/calendar.entity';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  @IsUrl()
  link: string;

  @Column()
  isPrivate: boolean;

  @Column()
  alert: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ default: '#ffffff' })
  @IsHexColor()
  color: string;

  @ManyToOne(() => CalendarEntity, (calendar) => calendar.events)
  calendar: CalendarEntity;
}

 */

export class EventDTO {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly link: string;
  readonly isPrivate: boolean;
  readonly alert: number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly description: string;
  readonly color: string;
}
