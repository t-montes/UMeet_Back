import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find(/*{relations: ['calendar', 'friends', 'groups']}*/);
    }

    async findOne(id: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id },
            /*relations: ['calendar', 'friends', 'groups'],*/
        });
        if (!user) throw new Error('The user with the given id was not found');
        return user;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }

    async update(id: string, user: UserEntity): Promise<UserEntity> {
        const persistedUser: UserEntity = await this.userRepository.findOne({
            where: { id },
        });
        if (!persistedUser)
            throw new Error('The user with the given id was not found');

        user.id = id;

        return await this.userRepository.save(user);
    }

    async delete(id: string) {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) throw new Error('The user with the given id was not found');

        await this.userRepository.remove(user);
    }
}
