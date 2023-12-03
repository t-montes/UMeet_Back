import { Injectable } from '@nestjs/common';
import { APIUser } from './person';

@Injectable()
export class PersonService {
  // id, username, password, [roles], {permissions}
  private users: APIUser[] = [
    /* -------------------- group -------------------- */
    new APIUser(1, 'groupAll', 'admin', ['admin'], {
      groups: ['read', 'write', 'delete'],
    }),
    new APIUser(2, 'groupRead', 'read', ['user'], {
      groups: ['read'],
    }),
    new APIUser(3, 'groupWrite', 'write', ['user'], {
      groups: ['write'],
    }),
    new APIUser(4, 'groupDelete', 'delete', ['user'], {
      groups: ['delete'],
    }),
    /* -------------------- user -------------------- */
    new APIUser(5, 'userAll', 'admin', ['admin'], {
      users: ['read', 'write', 'delete'],
    }),
    new APIUser(6, 'userRead', 'read', ['user'], {
      users: ['read'],
    }),
    new APIUser(7, 'userWrite', 'write', ['user'], {
      users: ['write'],
    }),
    new APIUser(8, 'userDelete', 'delete', ['user'], {
      users: ['delete'],
    }),
  ];

  async findOne(username: string): Promise<APIUser | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
