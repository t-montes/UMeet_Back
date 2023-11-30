/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { GroupEntity } from '../group/group.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GroupUserService } from './group-user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('GroupUserService', () => {
  let service: GroupUserService;
  let groupRepository: Repository<GroupEntity>;
  let userRepository: Repository<UserEntity>;
  let group: GroupEntity;
  let membersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GroupUserService],
    }).compile();

    service = module.get<GroupUserService>(GroupUserService);
    groupRepository = module.get<Repository<GroupEntity>>(
      getRepositoryToken(GroupEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    userRepository.clear();
    groupRepository.clear();

    membersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity = await userRepository.save({
        name: faker.person.firstName(),
        login: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      membersList.push(user);
    }

    group = await groupRepository.save({
      name: faker.company.name(),
      topic: faker.lorem.sentence(),
      members: membersList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addUserGroup should add an user to a group', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.person.firstName(),
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const newGroup: GroupEntity = await groupRepository.save({
      name: faker.company.name(),
      topic: faker.lorem.sentence(),
    });

    const result: GroupEntity = await service.addUserGroup(
      newGroup.id,
      newUser.id,
    );

    expect(result.members.length).toBe(1);
    expect(result.members[0]).not.toBeNull();
    expect(result.members[0].name).toBe(newUser.name);
    expect(result.members[0].login).toBe(newUser.login);
    expect(result.members[0].email).toBe(newUser.email);
  });

  it('addUserGroup should thrown exception for an invalid user', async () => {
    const newGroup: GroupEntity = await groupRepository.save({
      name: faker.company.name(),
      topic: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addUserGroup(newGroup.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('addUserGroup should throw an exception for an invalid group', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.person.firstName(),
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    await expect(() =>
      service.addUserGroup('0', newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });

  it('findUserByGroupIdUserId should return user by group', async () => {
    const user: UserEntity = membersList[0];
    const storedUser: UserEntity = await service.findUserByGroupIdUserId(
      group.id,
      user.id,
    );
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toBe(user.name);
    expect(storedUser.login).toBe(user.login);
    expect(storedUser.email).toBe(user.email);
  });

  it('findUserByGroupIdUserId should throw an exception for an invalid user', async () => {
    await expect(() =>
      service.findUserByGroupIdUserId(group.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('findUserByGroupIdUserId should throw an exception for an invalid group', async () => {
    const user: UserEntity = membersList[0];
    await expect(() =>
      service.findUserByGroupIdUserId('0', user.id),
    ).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });

  it('findUserByGroupIdUserId should throw an exception for an user not associated to the group', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.person.firstName(),
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    await expect(() =>
      service.findUserByGroupIdUserId(group.id, newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id is not associated to the group',
    );
  });

  it('findUsersByGroupId should return members by group', async () => {
    const members: UserEntity[] = await service.findMembersByGroupId(group.id);
    expect(members.length).toBe(5);
  });

  it('findUsersByGroupId should throw an exception for an invalid group', async () => {
    await expect(() =>
      service.findMembersByGroupId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });

  it('associateUsersGroup should update members list for a group', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.person.firstName(),
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const updatedGroup: GroupEntity = await service.associateMembersGroup(
      group.id,
      [newUser],
    );
    expect(updatedGroup.members.length).toBe(1);

    expect(updatedGroup.members[0].name).toBe(newUser.name);
    expect(updatedGroup.members[0].login).toBe(newUser.login);
    expect(updatedGroup.members[0].email).toBe(newUser.email);
  });

  it('associateUsersGroup should throw an exception for an invalid group', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.person.firstName(),
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    await expect(() =>
      service.associateMembersGroup('0', [newUser]),
    ).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });

  it('associateUsersGroup should throw an exception for an invalid user', async () => {
    const newUser: UserEntity = membersList[0];
    newUser.id = '0';

    await expect(() =>
      service.associateMembersGroup(group.id, [newUser]),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteUserToGroup should remove an user from a group', async () => {
    const user: UserEntity = membersList[0];

    await service.deleteUserGroup(group.id, user.id);

    const storedGroup: GroupEntity = await groupRepository.findOne({
      where: { id: group.id },
      relations: ['members'],
    });
    const deletedUser: UserEntity = storedGroup.members.find(
      (a) => a.id === user.id,
    );

    expect(deletedUser).toBeUndefined();
  });

  it('deleteUserToGroup should thrown an exception for an invalid user', async () => {
    await expect(() =>
      service.deleteUserGroup(group.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('deleteUserToGroup should thrown an exception for an invalid group', async () => {
    const user: UserEntity = membersList[0];
    await expect(() =>
      service.deleteUserGroup('0', user.id),
    ).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });

  it('deleteUserToGroup should thrown an exception for an non asocciated user', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.person.firstName(),
      login: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    await expect(() =>
      service.deleteUserGroup(group.id, newUser.id),
    ).rejects.toHaveProperty(
      'message',
      'The user with the given id is not associated to the group',
    );
  });
});
