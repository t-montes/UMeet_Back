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
    notificationRepository = module.get<Repository<NotificationEntity>>(getRepositoryToken(NotificationEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await userRepository.clear();
    const newUser = new UserEntity();
    newUser.login = faker.lorem.word();
    newUser.password = faker.lorem.word();
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
      // Assign the User to the Notification
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

  it('should create a new notification', async () => {
    const newNotification: NotificationEntity = {
      id: undefined,
      text: 'New notification text',
      date: new Date(),
      redirection: faker.internet.url(),
      user: user,
    };

    const createdNotification = await service.create(newNotification);
    expect(createdNotification).not.toBeNull();
    expect(createdNotification.text).toEqual(newNotification.text);
  });

  it('should update a notification', async () => {
    const notification = notificationList[0];
    const updatedText = 'Updated notification text';

    const updated = await service.update(notification.id, {
      ...notification,
      text: updatedText,
    });

    expect(updated).not.toBeNull();
    expect(updated.text).toEqual(updatedText);
  });

  it('should delete a notification', async () => {
    const notification = notificationList[0];
  
    await service.delete(notification.id);
  
    const deletedNotification = await notificationRepository.findOne({
      where: { id: notification.id }
    });
    expect(deletedNotification).toBeNull();
  });
});
