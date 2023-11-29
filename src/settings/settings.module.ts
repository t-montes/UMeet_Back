import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsEntity } from './settings.entity';
import { UserEntity } from '../user/user.entity';
import { SettingsController } from './settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity, UserEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
