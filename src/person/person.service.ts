/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Person } from './person';

@Injectable()
export class PersonService {
    private users: Person[] = [
        new Person(1, "admin", "admin", ["admin"]),
        new Person(2, "user", "admin", ["user"]),
    ];

    async findOne(username: string): Promise<Person | undefined> {
        return this.users.find(user => user.username === username);
    }
}
