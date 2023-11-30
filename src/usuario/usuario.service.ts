import { Injectable } from '@nestjs/common';
import { Usuario } from './usuario';

@Injectable()
export class UsuarioService {
   private usuarios: Usuario[] = [
       new Usuario(1, "admin", "admin", ["admin"]),
       new Usuario(2, "usuario", "admin", ["usuario"]),
   ];

   async findOne(username: string): Promise<Usuario | undefined> {
       return this.usuarios.find(usuario => usuario.username === username);
   }
}