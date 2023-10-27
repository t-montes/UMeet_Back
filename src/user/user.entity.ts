import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { CalendarEntity } from '../calendar/calendar.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    login: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => CalendarEntity, (calendar) => calendar.user)
    calendar: CalendarEntity;
}
