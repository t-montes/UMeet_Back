import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '../group/group.entity';
import { UserEntity } from '../user/user.entity';
import { GroupUserController } from './group-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, UserEntity])],
  providers: [GroupUserService],
  controllers: [GroupUserController],
})
export class GroupUserModule {}
