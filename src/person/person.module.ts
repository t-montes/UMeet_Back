import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PersonService, AuthService, JwtService],
  controllers: [PersonController],
})
export class PersonModule {}
