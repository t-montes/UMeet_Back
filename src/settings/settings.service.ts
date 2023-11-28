import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsEntity } from './settings.entity';
import { UserEntity } from '../user/user.entity';
import { validateEntity } from '../shared/utils';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<SettingsEntity[]> {
    return await this.settingsRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<SettingsEntity> {
    const settings: SettingsEntity = await this.settingsRepository.findOne({
      where: { id },
    });
    if (!settings)
      throw new BadRequestException(
        'The settings with the given id was not found',
      );
    return settings;
  }

  async create(settings: SettingsEntity): Promise<SettingsEntity> {
    return await this.settingsRepository.save(settings);
  }

  async update(id: string, settings: SettingsEntity): Promise<SettingsEntity> {
    const persistedSettings: SettingsEntity =
      await this.settingsRepository.findOne({
        where: { id },
      });

    if (!persistedSettings)
      throw new BadRequestException(
        'The settings with the given id was not found',
      );

    return await this.settingsRepository.save({
      ...persistedSettings,
      ...settings,
    });
  }

  async delete(id: string) {
    const settings: SettingsEntity = await this.settingsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!settings)
      throw new BadRequestException(
        'The settings with the given id was not found',
      );

    await this.settingsRepository.remove(settings);
  }
}
