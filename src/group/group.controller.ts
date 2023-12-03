import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GroupService } from './group.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { GroupEntity } from './group.entity';
import { GroupDto } from './group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../shared/decorators/permissions.decorator';

@Controller('groups')
@UseInterceptors(BusinessErrorsInterceptor)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('groups:read')
  @Get()
  async findAll() {
    return await this.groupService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('groups:read')
  @Get(':groupId')
  async findOne(@Param('groupId') groupId: string) {
    return await this.groupService.findOne(groupId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('groups:write')
  @Post()
  async create(@Body() groupDto: GroupDto) {
    const group: GroupEntity = plainToInstance(GroupEntity, groupDto);
    return await this.groupService.create(group);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('groups:write')
  @Put(':groupId')
  async update(@Param('groupId') groupId: string, @Body() groupDto: GroupDto) {
    const group: GroupEntity = plainToInstance(GroupEntity, groupDto);
    return await this.groupService.update(groupId, group);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('groups:delete')
  @Delete(':groupId')
  @HttpCode(204)
  async delete(@Param('groupId') groupId: string) {
    return await this.groupService.delete(groupId);
  }
}
