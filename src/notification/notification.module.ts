import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from '../user/user.entity';
import { NotificationController } from './notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
