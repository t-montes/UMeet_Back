import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
import { GroupService } from './group.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('GroupService', () => {
  let service: GroupService;
  let groupRepository: Repository<GroupEntity>;
  let groupList: GroupEntity[] = [];

  const seedDatabase = async () => {
    groupRepository.clear();
    groupList = [];
    for (let i = 0; i < 5; i++) {
      const group = new GroupEntity();
      group.name = faker.commerce.productName();
      group.topic = faker.company.bs();
      const savedGroup: GroupEntity = await groupRepository.save(group);
      groupList.push(savedGroup);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GroupService],
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupRepository = module.get<Repository<GroupEntity>>(
      getRepositoryToken(GroupEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all groups', async () => {
    const groups: GroupEntity[] = await service.findAll();
    expect(groups).not.toBeNull();
    expect(groups).toHaveLength(groupList.length);
  });

  it('findOne should return a group by id', async () => {
    const storedGroup: GroupEntity = groupList[0];
    const group: GroupEntity = await service.findOne(storedGroup.id);
    expect(group).not.toBeNull();
    expect(group.name).toEqual(storedGroup.name);
    expect(group.topic).toEqual(storedGroup.topic);
  });

  it('findOne should throw an exception for an invalid group', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });

  it('create should return a new group', async () => {
    const group: GroupEntity = new GroupEntity();
    group.name = faker.commerce.productName();
    group.topic = faker.company.bs();

    const newGroup: GroupEntity = await service.create(group);
    expect(newGroup).not.toBeNull();

    const storedGroup: GroupEntity = await groupRepository.findOne({
      where: { id: newGroup.id },
    });
    expect(storedGroup).not.toBeNull();
    expect(storedGroup.name).toEqual(newGroup.name);
    expect(storedGroup.topic).toEqual(newGroup.topic);
  });

  it('update should modify a group', async () => {
    const group: GroupEntity = groupList[0];
    group.name = faker.commerce.productName();
    group.topic = faker.company.bs();

    const updatedGroup: GroupEntity = await service.update(group.id, group);
    expect(updatedGroup).not.toBeNull();

    const storedGroup: GroupEntity = await groupRepository.findOne({
      where: { id: group.id },
    });
    expect(storedGroup).not.toBeNull();
    expect(storedGroup.name).toEqual(group.name);
    expect(storedGroup.topic).toEqual(group.topic);
  });

  it('update should throw an exception for an invalid group', async () => {
    const group: GroupEntity = new GroupEntity();
    group.id = '0';
    group.name = faker.commerce.productName();
    group.topic = faker.company.bs();

    await expect(() => service.update(group.id, group)).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });

  it('delete should remove a group', async () => {
    const storedGroup: GroupEntity = groupList[0];
    await service.delete(storedGroup.id);

    const group: GroupEntity = await groupRepository.findOne({
      where: { id: storedGroup.id },
    });
    expect(group).toBeNull();
  });

  it('delete should throw an exception for an invalid group', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The group with the given id was not found',
    );
  });
});
