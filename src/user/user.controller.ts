import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UseInterceptors, UseGuards } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../shared/decorators/permissions.decorator';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:read')
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:read')
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:read')
  @Get(':userId/groups')
  async findGroupsByUserId(@Param('userId') userId: string) {
    return await this.userService.findGroups(userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:write')
  @Post()
  @HttpCode(201)
  async create(@Body() userDTO: UserDTO) {
    return await this.userService.create(plainToInstance(UserEntity, userDTO));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:write')
  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() userDTO: UserDTO) {
    return await this.userService.update(
      userId,
      plainToInstance(UserEntity, userDTO),
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:delete')
  @Delete(':userId')
  @HttpCode(204)
  async delete(@Param('userId') userId: string) {
    return await this.userService.delete(userId);
  }
}
