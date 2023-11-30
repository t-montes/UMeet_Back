import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './notification.dto';
import { NotificationEntity } from './notification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    async findAll(): Promise<NotificationEntity[]> {
        return await this.notificationService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<NotificationEntity> {
        const notification = await this.notificationService.findOne(id);
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        return notification;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() notificationDto: NotificationDto, @Param('userId') userId: string): Promise<NotificationEntity> {
        const notification = new NotificationEntity();
        Object.assign(notification, notificationDto);
        return await this.notificationService.create(notification, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() notificationDto: NotificationDto, @Param('userId') userId: string): Promise<NotificationEntity> {
        const notification = new NotificationEntity();
        Object.assign(notification, notificationDto);
        return await this.notificationService.update(id, notification, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const notification = await this.notificationService.findOne(id);
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        await this.notificationService.delete(id);
    }
}
