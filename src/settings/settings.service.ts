import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsEntity } from './settings.entity';
import { UserEntity } from '../user/user.entity';

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

  async create(settings: SettingsEntity, userId: string): Promise<SettingsEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    settings.user = user;
    return await this.settingsRepository.save(settings);
  }

  async update(id: string, settings: SettingsEntity, userId: string): Promise<SettingsEntity> {
    const existingSettings = await this.settingsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!existingSettings) {
      throw new BadRequestException('Settings not found');
    }

    if (existingSettings.user.id !== userId) {
      throw new BadRequestException('User mismatch');
    }

    Object.assign(existingSettings, settings);
    return await this.settingsRepository.save(existingSettings);
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
