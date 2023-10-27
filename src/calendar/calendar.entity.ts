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

    @Column()
    color: string;

    @OneToOne(() => UserEntity, (user) => user.calendar)
    @JoinColumn()
    user: UserEntity;
}
