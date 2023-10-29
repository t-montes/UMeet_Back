import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsUrl, IsHexColor } from 'class-validator';
import { CalendarEntity } from '../calendar/calendar.entity';
import { IsOptional } from '../shared/utils';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true, select: false })
  @IsUrl()
  @IsOptional()
  link: string;

  @Column()
  isPrivate: boolean;

  @Column({ nullable: true, select: false })
  alert: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true, select: false })
  description: string;

  @Column({ default: '#ffffff' })
  @IsHexColor()
  color: string;

  @ManyToOne(() => CalendarEntity, (calendar) => calendar.events, {
    onDelete: 'CASCADE',
  })
  calendar: CalendarEntity;
}
