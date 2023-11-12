import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity()
export class SettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startHour: number;

  @Column()
  endHour: number;

  @Column()
  lastLaborDay: number;

  @Column()
  enableGrid: boolean;

  @OneToOne(() => UserEntity, (user) => user.settings)
  user: UserEntity;
}
