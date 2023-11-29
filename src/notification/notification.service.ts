import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<NotificationEntity> {
    const notification: NotificationEntity =
      await this.notificationRepository.findOne({
        where: { id },
        relations: ['user'],
      });
    if (!notification)
      throw new BadRequestException(
        'The notification with the given id was not found',
      );
    return notification;
  }

  async create(notification: NotificationEntity, userId: string): Promise<NotificationEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    notification.user = user;
    return await this.notificationRepository.save(notification);
  }

  async update(id: string, notificationDto: NotificationEntity, userId: string): Promise<NotificationEntity> {
    const existingNotification = await this.notificationRepository.findOne({ 
      where: { id },
      relations: ['user'], 
    });

    if (!existingNotification) {
      throw new BadRequestException('Notification not found');
    }
    if (existingNotification.user.id !== userId) {
      throw new BadRequestException('User mismatch');
    }
    Object.assign(existingNotification, notificationDto);
    return await this.notificationRepository.save(existingNotification);
  }

  async delete(id: string) {
    const notification: NotificationEntity =
      await this.notificationRepository.findOne({
        where: { id },
      });
    if (!notification)
      throw new BadRequestException(
        'The notification with the given id was not found',
      );

    await this.notificationRepository.remove(notification);
  }
}
