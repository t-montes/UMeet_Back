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
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll(): Promise<SettingsEntity[]> {
    return await this.settingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SettingsEntity> {
    const settings = await this.settingsService.findOne(id);
    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    return settings;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() settingsDto: SettingsDto,
    @Param('userId') userId: string,
  ): Promise<SettingsEntity> {
    const settings = new SettingsEntity();
    Object.assign(settings, settingsDto);
    return await this.settingsService.create(settings, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() settingsDto: SettingsDto,
    @Param('userId') userId: string,
  ): Promise<SettingsEntity> {
    const settings = new SettingsEntity();
    Object.assign(settings, settingsDto);
    return await this.settingsService.update(id, settings, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const settings = await this.settingsService.findOne(id);
    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    await this.settingsService.delete(id);
  }
}
