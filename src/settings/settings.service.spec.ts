import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { SettingsService } from './settings.service';
import { SettingsEntity } from './settings.entity';
import { UserEntity } from './../user/user.entity';

describe('SettingsService', () => {
  let service: SettingsService;
  let settingsRepository: Repository<SettingsEntity>;
  let userRepository: Repository<UserEntity>;
  let settingsList: SettingsEntity[] = [];
  let user: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SettingsService],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    settingsRepository = module.get<Repository<SettingsEntity>>(
      getRepositoryToken(SettingsEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await userRepository.clear();
    const newUser = new UserEntity();
    newUser.name = faker.person.fullName();
    newUser.login = faker.internet.userName();
    newUser.email = faker.internet.email();
    newUser.password = faker.internet.password({ prefix: 'Pw0' });
    user = await userRepository.save(newUser);

    await settingsRepository.clear();
    settingsList = [];
    const newSettings = new SettingsEntity();
    newSettings.startHour = faker.number.int();
    newSettings.endHour = faker.number.int();
    newSettings.lastLaborDay = faker.number.int();
    newSettings.enableGrid = faker.datatype.boolean();
    newSettings.user = user;
    const settings: SettingsEntity = await settingsRepository.save(newSettings);
    settingsList.push(settings);
  };

  it('findAll should return all settings', async () => {
    const settings: SettingsEntity[] = await service.findAll();
    expect(settings).not.toBeNull();
    expect(settings).toHaveLength(settingsList.length);
  });

  it('findOne should return a setting by id', async () => {
    const storedSettings: SettingsEntity = settingsList[0];
    const settings: SettingsEntity = await service.findOne(storedSettings.id);
    expect(settings).not.toBeNull();
    expect(settings.startHour).toEqual(storedSettings.startHour);
    expect(settings.endHour).toEqual(storedSettings.endHour);
    expect(settings.lastLaborDay).toEqual(storedSettings.lastLaborDay);
    expect(settings.enableGrid).toEqual(storedSettings.enableGrid);
  });

  it('should find a settings by id', async () => {
    const settings = settingsList[0];
    const found = await service.findOne(settings.id);
    expect(found).not.toBeNull();
    expect(found.id).toEqual(settings.id);
  });

  it('findOne should throw an exception for an invalid settings', async () => {
    await expect(() =>
      service.findOne('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty(
      'message',
      'The settings with the given id was not found',
    );
  });

  it('create should return a new settings', async () => {
    // Crear un nuevo usuario para cada configuración de ajustes
    const newUser = new UserEntity();
    newUser.name = faker.person.fullName();
    newUser.login = faker.internet.userName();
    newUser.email = faker.internet.email();
    newUser.password = faker.internet.password();

    const createdUser = await userRepository.save(newUser);

    const settings: SettingsEntity = new SettingsEntity();
    settings.startHour = faker.number.int();
    settings.endHour = faker.number.int();
    settings.lastLaborDay = faker.number.int();
    settings.enableGrid = faker.datatype.boolean();
    settings.user = createdUser; // Asignar el nuevo usuario

    const newSettings: SettingsEntity = await service.create(
      settings,
      createdUser.id,
    );
    expect(newSettings).not.toBeNull();

    const storedSettings: SettingsEntity = await settingsRepository.findOne({
      where: { id: newSettings.id },
      relations: ['user'],
    });
    expect(storedSettings).not.toBeNull();
    expect(storedSettings.user.id).toEqual(createdUser.id);
  });

  it('create should return a new settings', async () => {
    // Crear un nuevo usuario para cada configuración de ajustes
    const newUser = new UserEntity();
    newUser.name = faker.person.fullName();
    newUser.login = faker.internet.userName();
    newUser.email = faker.internet.email();
    newUser.password = faker.internet.password();

    const createdUser = await userRepository.save(newUser);

    const settings: SettingsEntity = new SettingsEntity();
    settings.startHour = faker.number.int();
    settings.endHour = faker.number.int();
    settings.lastLaborDay = faker.number.int();
    settings.enableGrid = faker.datatype.boolean();
    settings.user = createdUser;

    const newSettings: SettingsEntity = await service.create(
      settings,
      createdUser.id,
    );
    expect(newSettings).not.toBeNull();
    expect(newSettings.user.id).toEqual(createdUser.id);
  });

  it('should update a settings', async () => {
    const settings = settingsList[0];
    const updatedStartHour = faker.number.int();
    const userId = settings.user.id;
    settings.startHour = updatedStartHour;
    const updated = await service.update(settings.id, settings, userId);
    expect(updated).not.toBeNull();
    expect(updated.startHour).toEqual(updatedStartHour);
  });

  it('update should throw an exception for an invalid setting id', async () => {
    const invalidId = '00000000-0000-0000-0000-000000000000';
    const updateData = new SettingsEntity();
    updateData.startHour = faker.number.int();
    updateData.endHour = faker.number.int();
    updateData.lastLaborDay = faker.number.int();
    updateData.enableGrid = faker.datatype.boolean();
    const userId = user.id;

    await expect(() =>
      service.update(invalidId, updateData, userId),
    ).rejects.toHaveProperty('message', 'Settings not found');
  });

  it('delete should throw an exception for an invalid setting id', async () => {
    const invalidId = '00000000-0000-0000-0000-000000000000';

    await expect(() => service.delete(invalidId)).rejects.toHaveProperty(
      'message',
      'The settings with the given id was not found',
    );
  });

  it('delete should remove a setting', async () => {
    const storedSettings: SettingsEntity = settingsList[0];
    await service.delete(storedSettings.id);
    const settings: SettingsEntity = await settingsRepository.findOne({
      where: { id: storedSettings.id },
    });
    expect(settings).toBeNull();
  });

  it('delete should throw an exception for an invalid setting', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The settings with the given id was not found',
    );
  });
});
