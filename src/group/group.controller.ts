import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GroupService } from './group.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { GroupEntity } from './group.entity';
import { GroupDto } from './group.dto';

@Controller('groups')
@UseInterceptors(BusinessErrorsInterceptor)
export class GroupController {
    constructor(private readonly groupService: GroupService){}

    @Get()
    async findAll() {
      return await this.groupService.findAll();
    }
  
    @Get(':groupId')
    async findOne(@Param('groupId') groupId: string) {
      return await this.groupService.findOne(groupId);
    }
  
    @Post()
    async create(@Body() groupDto: GroupDto) {
      const group: GroupEntity = plainToInstance(GroupEntity, groupDto);
      return await this.groupService.create(group);
    }
  
    @Put(':groupId')
    async update(@Param('groupId') groupId: string, @Body() groupDto: GroupDto) {
      const group: GroupEntity = plainToInstance(GroupEntity, groupDto);
      return await this.groupService.update(groupId, group);
    }
  
    @Delete(':groupId')
    @HttpCode(204)
    async delete(@Param('groupId') groupId: string) {
      return await this.groupService.delete(groupId);
    }
}
