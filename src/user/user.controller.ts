import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { UserService } from './user.service';
import { Get, Post, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { UserDTO } from './user.dto';

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

    @Post()
    @HttpCode(201)
    async create(@Body() userDTO: UserDTO) {
        return await this.userService.create(userDTO);
    }

    @Put(':userId')
    async update(@Param('userId') userId: string, @Body() userDTO: UserDTO) {
        return await this.userService.update(userId, userDTO);
    }

    @Delete(':userId')
    @HttpCode(204)
    async delete(@Param('userId') userId: string) {
        return await this.userService.delete(userId);
    }
}
