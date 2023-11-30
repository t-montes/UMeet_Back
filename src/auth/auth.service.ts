/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { Usuario } from '../usuario/usuario';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuarioService,
        private jwtService: JwtService
    ) {}

    async validateUsuario(username: string, password: string): Promise<any> {
        const usuario: Usuario = await this.usuariosService.findOne(username);
        if (usuario && usuario.password === password) {
            const { password, ...result } = usuario;
            return result;
        }
        return null;
    }

    async login(req: any) {
        const payload = { username: req.usuario.username, sub: req.usuario.id };
        return {
            token: this.jwtService.sign(payload, { privateKey: constants.JWT_SECRET, expiresIn:constants.JWT_EXPIRES_IN }),
        };
    }

}
