import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity()
export class SettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 6 }) // 6 am
  startHour: number;

  @Column({ default: 20 }) // 8 pm
  endHour: number;

  @Column({ default: 7 }) // monday-sunday
  lastLaborDay: number;

  @Column({ default: true })
  enableGrid: boolean;

  @OneToOne(() => UserEntity, (user) => user.calendar, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
