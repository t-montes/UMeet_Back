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
  let calendar: CalendarEntity;

  const seedDatabase = async () => {
    userRepository.clear();
    usersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await userRepository.save({
        name: faker.person.fullName(),
        login: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      usersList.push(user);
    }

    calendarRepository.clear();
    calendar = await calendarRepository.save({
      color: faker.internet.color(),
    });
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
    expect(user.password).toEqual(storedUser.password);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('create should return a new user', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.person.fullName(),
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      calendar,
    };

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser: UserEntity = await userRepository.findOne({
      where: { id: newUser.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(newUser.name);
    expect(storedUser.login).toEqual(newUser.login);
    expect(storedUser.email).toEqual(newUser.email);
    expect(storedUser.password).toEqual(newUser.password);
  });

  it('update should modify an user', async () => {
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
    expect(storedUser.password).toEqual(user.password);
  });

  it('update should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.update('0', {
        id: '0',
        name: faker.person.fullName(),
        login: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        calendar,
      }),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('delete should remove an user', async () => {
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
