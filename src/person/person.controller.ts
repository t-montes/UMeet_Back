/* eslint-disable prettier/prettier */
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('people')
export class PersonController {

    constructor(private readonly authService: AuthService){}
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: any) {
        return this.authService.login(req);
    }
}
