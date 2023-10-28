import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { UserEntity } from './user.entity';
import { CalendarEntity } from '../calendar/calendar.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
  let calendarRepository: Repository<CalendarEntity>;
  let usersList: UserEntity[] = [];
  let calendarList: CalendarEntity[] = [];

  const seedDatabase = async () => {
    calendarRepository.clear();
    calendarList = [];
    for (let i = 0; i < 5; i++) {
      const newEntity = new CalendarEntity();
      newEntity.color = faker.internet.color();
      const calendar: CalendarEntity = await calendarRepository.save(newEntity);
      calendarList.push(calendar);
    }

    userRepository.clear();
    usersList = [];
    for (let i = 0; i < 5; i++) {
      const newEntity = new UserEntity();
      newEntity.name = faker.person.fullName();
      newEntity.login = faker.internet.userName();
      newEntity.email = faker.internet.email();
      newEntity.password = faker.internet.password({ prefix: 'Pw0' });
      newEntity.calendar = calendarList[i];
      const user: UserEntity = await userRepository.save(newEntity);
      usersList.push(user);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    calendarRepository = module.get<Repository<CalendarEntity>>(
      getRepositoryToken(CalendarEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(usersList.length);
  });

  it('findOne should return a user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findOne(storedUser.id);
    expect(user).not.toBeNull();
    expect(user.name).toEqual(storedUser.name);
    expect(user.login).toEqual(storedUser.login);
    expect(user.email).toEqual(storedUser.email);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('create should return a new user', async () => {
    const user: UserEntity = new UserEntity();
    user.name = faker.person.fullName();
    user.login = faker.internet.userName();
    user.email = faker.internet.email();
    user.password = faker.internet.password({ prefix: 'Pw0' });

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: newUser.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(newUser.name);
    expect(storedUser.login).toEqual(newUser.login);
    expect(storedUser.email).toEqual(newUser.email);
  });

  it('update should modify a user', async () => {
    const user: UserEntity = usersList[0];
    user.name = faker.person.fullName();
    user.login = faker.internet.userName();

    const updatedUser: UserEntity = await service.update(user.id, user);
    expect(updatedUser).not.toBeNull();

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: user.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(user.name);
    expect(storedUser.login).toEqual(user.login);
    expect(storedUser.email).toEqual(user.email);
  });

  it('update should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.update('0', usersList[0]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('delete should remove a user', async () => {
    const storedUser: UserEntity = usersList[0];
    await service.delete(storedUser.id);
    const user: UserEntity = await userRepository.findOne({
      where: { id: storedUser.id },
    });
    expect(user).toBeNull();
  });

  it('delete should throw an exception for an invalid user', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });
});
