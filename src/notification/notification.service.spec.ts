import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from './../user/user.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Repository<NotificationEntity>;
  let userRepository: Repository<UserEntity>;
  let notificationList: NotificationEntity[] = [];
  let user: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<NotificationEntity>>(
      getRepositoryToken(NotificationEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await userRepository.clear();
    const newUser = new UserEntity();
    newUser.login = faker.lorem.word();
    newUser.password = faker.internet.password();
    newUser.email = faker.lorem.word();
    newUser.name = faker.lorem.word();
    user = await userRepository.save(newUser);

    await notificationRepository.clear();
    notificationList = [];
    for (let i = 0; i < 5; i++) {
      const newNotification = new NotificationEntity();
      newNotification.text = faker.lorem.word();
      newNotification.date = faker.date.future();
      newNotification.redirection = faker.internet.url();
      newNotification.user = user;
      const notification = await notificationRepository.save(newNotification);
      notificationList.push(notification);
    }
  };

  it('should find all notifications', async () => {
    const notifications = await service.findAll();
    expect(notifications).not.toBeNull();
    expect(notifications).toHaveLength(notificationList.length);
  });

  it('should find a notification by id', async () => {
    const notification = notificationList[0];
    const found = await service.findOne(notification.id);
    expect(found).not.toBeNull();
    expect(found.id).toEqual(notification.id);
  });

  it('findOne should throw an exception for an invalid notification id', async () => {
    await expect(() => 
      service.findOne('invalid-id')
    ).rejects.toHaveProperty(
      'message', 
      'The notification with the given id was not found'
    );
  });

  it('create should return a new notification', async () => {
    const notification: NotificationEntity = new NotificationEntity();
    notification.text = faker.lorem.word();
    notification.date = faker.date.future();
    notification.redirection = faker.internet.url();
    const userId = user.id;
  
    const newNotification: NotificationEntity = await service.create(notification, userId);
    expect(newNotification).not.toBeNull();
  
    const storedNotification: NotificationEntity = await notificationRepository.findOne({
      where: { id: newNotification.id },
      relations: ['user'],
    });
    expect(storedNotification).not.toBeNull();
    expect(storedNotification.user.id).toEqual(userId);
  });

  it('create should throw an exception for invalid user', async () => {
    const notification: NotificationEntity = new NotificationEntity();
    notification.text = faker.lorem.word();
    notification.date = faker.date.future();
    notification.redirection = faker.internet.url();
    const invalidUserId = 'invalid-uuid';
  
    await expect(service.create(notification, invalidUserId)).rejects.toHaveProperty(
      'message', 
      'User not found'
    );
  });

  it('should update a notification', async () => {
    const notification = notificationList[0];
    const updatedText = 'Updated notification text';
    const userId = notification.user.id;
    const updated = await service.update(notification.id, {
      ...notification,
      text: updatedText,
    }, userId);
  
    expect(updated).not.toBeNull();
    expect(updated.text).toEqual(updatedText);
  });
  
  it('update should throw an exception for an invalid notification id', async () => {
    const invalidNotification = new NotificationEntity();
    invalidNotification.text = 'Invalid';
    const fakeUserId = 'any-valid-uuid';
  
    await expect(() => 
      service.update('invalid-id', invalidNotification, fakeUserId)
    ).rejects.toHaveProperty(
      'message', 
      'Notification not found'
    );
  });

  it('should delete a notification', async () => {
    const notification = notificationList[0];

    await service.delete(notification.id);

    const deletedNotification = await notificationRepository.findOne({
      where: { id: notification.id },
    });
    expect(deletedNotification).toBeNull();
  });

  it('delete should throw an exception for an invalid notification id', async () => {
    await expect(() => 
      service.delete('invalid-id')
    ).rejects.toHaveProperty(
      'message', 
      'The notification with the given id was not found'
    );
  });

  it('findAllByUserId should return empty array for a user with no notifications', async () => {
    const newUser = new UserEntity();
    newUser.login = faker.lorem.word();
    newUser.password = faker.internet.password();
    newUser.email = faker.lorem.word();
    newUser.name = faker.lorem.word();
    const noNotificationUser = await userRepository.save(newUser);
  
    const notifications = await service.findAllByUserId(noNotificationUser.id);
    expect(notifications).not.toBeNull();
    expect(notifications).toHaveLength(0);
  });
  
  it('findAllByUserId should throw an exception for an invalid user id', async () => {
    const invalidUserId = 'invalid-uuid';
    await expect(service.findAllByUserId(invalidUserId)).rejects.toHaveProperty(
      'message', 
      'User not found'
    );
  });

});
