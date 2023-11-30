/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuarioService } from '../usuario/usuario.service';
import constants from '../shared/security/constants';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
    imports: [
        UsuarioModule,
        PassportModule,
        JwtModule.register({
          secret: constants.JWT_SECRET,
          signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
        })
      ],
    providers: [AuthService, UsuarioService, JwtService, LocalStrategy, JwtStrategy], 
    exports: [AuthService]
    
})
export class AuthModule {}
