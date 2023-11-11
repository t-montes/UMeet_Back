import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [GroupService]
})
export class GroupModule {}
