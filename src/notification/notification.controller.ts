import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './notification.dto';
import { NotificationEntity } from './notification.entity';

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

    @Post()
    async create(@Body() notificationDto: NotificationDto): Promise<NotificationEntity> {
        return await this.notificationService.create(notificationDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() notificationDto: NotificationDto): Promise<NotificationEntity> {
        const notification = await this.notificationService.update(id, notificationDto);
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        return notification;
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const notification = await this.notificationService.findOne(id);
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        await this.notificationService.delete(id);
    }
}
