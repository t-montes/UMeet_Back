import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/user.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [UserEntity /* TODO: Add all entities */],
        synchronize: true,
        keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([UserEntity /* TODO: Add all entities */]),
];
