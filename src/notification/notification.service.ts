import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
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

  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    return await this.notificationRepository.save(notification);
  }

  async update(
    id: string,
    notification: NotificationEntity,
  ): Promise<NotificationEntity> {
    const persistedNotification: NotificationEntity =
      await this.notificationRepository.findOne({
        where: { id },
      });
    if (!persistedNotification)
      throw new BadRequestException(
        'The notification with the given id was not found',
      );

    return await this.notificationRepository.save({
      ...persistedNotification,
      ...notification,
    });
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
