import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @Column({ nullable: true })
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

  @ManyToOne(() => CalendarEntity, (calendar) => calendar.events, {
    onDelete: 'CASCADE',
  })
  calendar: CalendarEntity;
}
