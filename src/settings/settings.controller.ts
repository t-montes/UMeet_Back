import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './settings.dto';
import { SettingsEntity } from './settings.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SettingsEntity> {
    const settings = await this.settingsService.findOne(id);
    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    return settings;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':settingsId/user/:userId')
  async update(
    @Param('settingsId') settingsId: string,
    @Param('userId') userId: string,
    @Body() settingsDto: SettingsDto,
  ): Promise<SettingsEntity> {
    const settings = new SettingsEntity();
    Object.assign(settings, settingsDto);
    return await this.settingsService.update(
      settingsId,
      settings,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<SettingsEntity[]> {
    const settings = await this.settingsService.findAllByUserId(userId);
    if (settings.length === 0) {
      throw new NotFoundException('Settings not found for the user');
    }
    return settings;
  }

}
