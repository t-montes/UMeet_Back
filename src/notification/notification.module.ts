import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity])],
    providers: [],
    controllers: [],  
})
export class NotificationModule {}
