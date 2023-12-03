import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './settings.dto';
import { SettingsEntity } from './settings.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../shared/decorators/permissions.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:read')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SettingsEntity> {
    const settings = await this.settingsService.findOne(id);
    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    return settings;
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:read')
  @Get('/user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<SettingsEntity[]> {
    const settings = await this.settingsService.findAllByUserId(userId);
    if (settings.length === 0) {
      throw new NotFoundException('Settings not found for the user');
    }
    return settings;
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:write')
  @Put(':settingsId/user/:userId')
  async update(
    @Param('settingsId') settingsId: string,
    @Param('userId') userId: string,
    @Body() settingsDto: SettingsDto,
  ): Promise<SettingsEntity> {
    const settings = new SettingsEntity();
    Object.assign(settings, settingsDto);
    return await this.settingsService.update(settingsId, settings, userId);
  }

}
