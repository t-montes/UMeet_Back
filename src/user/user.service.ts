import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { GroupEntity } from '../group/group.entity';
import { CalendarEntity } from '../calendar/calendar.entity';
import { SettingsEntity } from '../settings/settings.entity';
import { validateEntity } from '../shared/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>,
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({relations: ['friends', 'groups']});
  }

  async findOne(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['calendar', 'settings' , 'friends', 'groups'],
    });
    if (!user)
      throw new BadRequestException('The user with the given id was not found');
    return user;
  }

  @validateEntity
  async create(user: UserEntity): Promise<UserEntity> {
    try {
      const calendar: CalendarEntity = await this.calendarRepository.save(
        new CalendarEntity(),
      );
      user.calendar = calendar;
      const defaultSettings = new SettingsEntity();
      const settings: SettingsEntity = await this.settingsRepository.save(
        defaultSettings,
      );
      user.settings = settings;
      const persistedUser = await this.userRepository.save(user);
      delete persistedUser.password;
      return persistedUser;
    } catch (e: any) {
      if (e instanceof QueryFailedError) {
        switch (+e.driverError.code) {
          case 23505:
            switch (e.driverError.constraint) {
              case 'unique-login':
                throw new BadRequestException('The login is already in use');
              case 'unique-email':
                throw new BadRequestException('The email is already in use');
              default:
                throw e;
            }
          case 23502:
            throw new BadRequestException(
              `Field '${e.driverError.column}' is required`,
            );
          default:
            throw e;
        }
      } else {
        throw new BadRequestException(e.message);
      }
    }
  }

  @validateEntity
  async update(id: string, user: UserEntity): Promise<UserEntity> {
    const persistedUser: UserEntity = await this.userRepository.findOne({
      where: { id },
    });
    if (!persistedUser)
      throw new BadRequestException('The user with the given id was not found');

    user.id = id;

    const updatedUser = await this.userRepository
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
          default:
            throw e;
        }
      });

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

    await this.userRepository.remove(user);
  }

  async addFriend(userId: string, friendId: string): Promise<UserEntity> {
    if (userId === friendId) {
      throw new BadRequestException('Users cannot befriend themselves');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
    });

    if (!user || !friend) {
      throw new BadRequestException('One or both users not found');
    }

    if (user.friends.some((f) => f.id === friendId)) {
      throw new BadRequestException('The users are already friends');
    }

    user.friends.push(friend);
    await this.userRepository.save(user);

    return user;
  }

  async removeFriend(userId: string, friendId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const friendIndex = user.friends.findIndex(
      (friend) => friend.id === friendId,
    );
    if (friendIndex === -1) {
      throw new BadRequestException('Friend not found');
    }

    user.friends.splice(friendIndex, 1);
    await this.userRepository.save(user);

    return user;
  }

  async findFriends(userId: string): Promise<UserEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.friends;
  }

  async findGroups(userId: string): Promise<GroupEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.groups;
  }
}
