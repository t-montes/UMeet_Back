import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, UseGuards } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @Get(':userId/groups')
  async findUsersByGroupId(@Param('userId') userId: string) {
    return await this.userService.findGroups(userId);
  }

  //@UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() userDTO: UserDTO) {
    return await this.userService.create(plainToInstance(UserEntity, userDTO));
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() userDTO: UserDTO) {
    return await this.userService.update(
      userId,
      plainToInstance(UserEntity, userDTO),
    );
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(':userId')
  @HttpCode(204)
  async delete(@Param('userId') userId: string) {
    return await this.userService.delete(userId);
  }
}
