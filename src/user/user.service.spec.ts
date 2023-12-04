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

  it('create should throw an exception for duplicate email', async () => {
    const user: UserEntity = new UserEntity();
    user.email = usersList[0].email; // Usar un email ya existente
    user.login = faker.internet.userName();
    user.password = 'contraSenha1234%';

    await expect(service.create(user)).rejects.toHaveProperty(
      'message',
      'SQLITE_CONSTRAINT: NOT NULL constraint failed: user_entity.name',
    );
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

  it('addFriend should add a friend to the user', async () => {
    const user1: UserEntity = usersList[0];
    const user2: UserEntity = usersList[1];

    await service.addFriend(user1.id, user2.id);
    await service.addFriend(user2.id, user1.id);

    const updatedUser1: UserEntity = await userRepository.findOne({
      where: { id: user1.id },
      relations: ['friends'],
    });

    const updatedUser2: UserEntity = await userRepository.findOne({
      where: { id: user2.id },
      relations: ['friends'],
    });

    expect(updatedUser1.friends).toHaveLength(1);
    expect(updatedUser1.friends[0].id).toEqual(user2.id);
    expect(updatedUser2.friends).toHaveLength(1);
    expect(updatedUser2.friends[0].id).toEqual(user1.id);
  });

  it('addFriend should throw an exception for adding self as friend', async () => {
    const user: UserEntity = usersList[0];

    await expect(service.addFriend(user.id, user.id)).rejects.toHaveProperty(
      'message',
      'Users cannot befriend themselves',
    );
  });

  it('addFriend should throw an exception for non-existent user', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(
      service.addFriend(nonExistentId, usersList[0].id),
    ).rejects.toHaveProperty('message', 'One or both users not found');
  });

  it('addFriend should not add a duplicate friend', async () => {
    const user1: UserEntity = usersList[0];
    const user2: UserEntity = usersList[1];

    await service.addFriend(user1.id, user2.id);

    await expect(service.addFriend(user1.id, user2.id)).rejects.toHaveProperty(
      'message',
      'The users are already friends',
    );
  });

  it('removeFriend should remove a friend from the user', async () => {
    const user1: UserEntity = usersList[0];
    const user2: UserEntity = usersList[1];

    await service.addFriend(user1.id, user2.id);
    await service.removeFriend(user1.id, user2.id);

    const updatedUser1: UserEntity = await userRepository.findOne({
      where: { id: user1.id },
      relations: ['friends'],
    });

    expect(updatedUser1.friends).toHaveLength(0);
  });

  it('removeFriend should not remove a non-existent friend', async () => {
    const user1: UserEntity = usersList[0];
    const user2: UserEntity = usersList[4]; // Assume user2 is not a friend of user1

    await expect(
      service.removeFriend(user1.id, user2.id),
    ).rejects.toHaveProperty('message', 'Friend not found');
  });

  it('removeFriend should throw an exception for non-existent user', async () => {
    const nonExistentId = 'non-existent-id';

    await expect(
      service.removeFriend(nonExistentId, usersList[0].id),
    ).rejects.toHaveProperty('message', 'User not found');
  });

  it('removeFriend should throw an exception for non-existent friend', async () => {
    const user1: UserEntity = usersList[0];
    const user2: UserEntity = usersList[1];

    await expect(
      service.removeFriend(user1.id, user2.id),
    ).rejects.toHaveProperty('message', 'Friend not found');
  });

  it('findNonFriends should return users who are not friends with the specified user', async () => {
    const user1: UserEntity = usersList[0];
    const user2: UserEntity = usersList[1];
    const nonFriends = await service.findNonFriends(user1.id);
    expect(nonFriends.some((u) => u.id === user2.id)).toBeTruthy();
    expect(nonFriends.some((u) => u.id === user1.id)).toBeFalsy();
  });

  it('findNonFriends should throw an exception for a non-existent user', async () => {
    const nonExistentId = 'non-existent-id';
    await expect(service.findNonFriends(nonExistentId)).rejects.toHaveProperty(
      'message',
      'User not found',
    );
  });

  it('removeFriend should throw an exception when users are not friends', async () => {
    const user1: UserEntity = usersList[0];
    const user2: UserEntity = usersList[1];

    const user1WithFriends = await userRepository.findOne({
      where: { id: user1.id },
      relations: ['friends'],
    });
    const isFriend = user1WithFriends.friends.some(
      (friend) => friend.id === user2.id,
    );
    if (isFriend) {
      await service.removeFriend(user1.id, user2.id);
    }

    await expect(
      service.removeFriend(user1.id, user2.id),
    ).rejects.toHaveProperty('message', 'Friend not found');
  });
});
