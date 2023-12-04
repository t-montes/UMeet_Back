import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { APIUser } from '../person/person';
import { PersonService } from '../person/person.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: PersonService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user: APIUser = await this.usersService.findOne(username);
        if (user && user.password === password) {
            const { password, permissions, ...result } = user;
            return {...result, permissions};
        }
        return null;
    }

    async login(req: any) {
        const user: APIUser = await this.usersService.findOne(req.user.username);
        const payload = { username: req.user.username, sub: req.user.id,  permissions: user.permissions};
        return {
            token: this.jwtService.sign(payload, { privateKey: constants.JWT_SECRET, expiresIn:constants.JWT_EXPIRES_IN }),
        };
    }
}
