import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CalendarEntity } from '../calendar/calendar.entity';
import { validateEntity } from '../shared/utils/validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find(/*{relations: ['friends', 'groups']}*/);
  }

  async findOne(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['calendar' /*, 'friends', 'groups' */],
    });
    if (!user)
      throw new BadRequestException('The user with the given id was not found');
    return user;
  }

  @validateEntity
  async create(user: UserEntity): Promise<UserEntity> {
    const calendar: CalendarEntity = await this.calendarRepository.save(
      new CalendarEntity(),
    );
    user.calendar = calendar;

    const persistedUser = await this.userRepository
      .save(user)
      .catch((e: QueryFailedError) => {
        switch (+e.driverError.code) {
          case 23505: // unique_violation
            switch (e.driverError.constraint) {
              case 'unique-login':
                throw new BadRequestException('The login is already in use');
              case 'unique-email':
                throw new BadRequestException('The email is already in use');
              default:
                throw e;
            }
          case 23502: // not_null_violation
            throw new BadRequestException(
              `Field '${e.driverError.column}' is required`,
            );
          default:
            throw e;
        }
      });

    delete persistedUser.password;
    return persistedUser;
  }

  @validateEntity
  async update(id: string, user: UserEntity): Promise<UserEntity> {
    const persistedUser: UserEntity = await this.userRepository.findOne({
      where: { id },
    });
    if (!persistedUser)
      throw new BadRequestException('The user with the given id was not found');

    user.id = id;

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async delete(id: string) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['calendar'],
    });

    if (!user)
      throw new BadRequestException('The user with the given id was not found');

    //await this.calendarRepository.remove(user.calendar);
    await this.userRepository.remove(user);
  }
}
