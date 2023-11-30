/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { Person } from '../person/person';
import { PersonService } from '../person/person.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: PersonService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user: Person = await this.usersService.findOne(username);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(req: any) {
        const payload = { username: req.user.username, sub: req.user.id };
        return {
            token: this.jwtService.sign(payload, { privateKey: constants.JWT_SECRET, expiresIn:constants.JWT_EXPIRES_IN }),
        };
    }

}
