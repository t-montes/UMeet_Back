import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../user/user.entity';
import { UserDTO } from '../user/user.dto';

@Controller('groups')
@UseInterceptors(BusinessErrorsInterceptor)
export class GroupUserController {
  constructor(private readonly groupUserService: GroupUserService) {}

  @Post(':groupId/owner/:userId')
  async addOwnerGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupUserService.addOwnerGroup(groupId, userId);
  }

  @Get(':groupId/owner')
  async findOwnerByGroupId(@Param('groupId') groupId: string) {
    return await this.groupUserService.findOwnerByGroupId(groupId);
  }

  @Post(':groupId/members/:userId')
  async addUserGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupUserService.addUserGroup(groupId, userId);
  }

  @Get(':groupId/members/:userId')
  async findUserByGroupIdUserId(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupUserService.findUserByGroupIdUserId(groupId, userId);
  }

  @Get(':groupId/members')
  async findUsersByGroupId(@Param('groupId') groupId: string) {
    return await this.groupUserService.findMembersByGroupId(groupId);
  }

  @Put(':groupId/members')
  async associateUsersGroup(
    @Body() usersDto: UserDTO[],
    @Param('groupId') groupId: string,
  ) {
    const users = plainToInstance(UserEntity, usersDto);
    return await this.groupUserService.associateMembersGroup(groupId, users);
  }

  @Delete(':groupId/members/:userId')
  @HttpCode(204)
  async deleteUserGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupUserService.deleteUserGroup(groupId, userId);
  }
}
