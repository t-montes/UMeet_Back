import { Injectable } from '@nestjs/common';
import { APIUser } from './person';

@Injectable()
export class PersonService {
  // id, username, password, [roles], {permissions}
  private users: APIUser[] = [
    new APIUser(0, 'admin', 'admin', ['admin'], {
      groups: ['read', 'write', 'delete'],
      users: ['read', 'write', 'delete'],
      calendars: ['read', 'write', 'delete'],
      events: ['read', 'write', 'delete'],
    }),
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
    /* -------------------- calendar -------------------- */
    new APIUser(9, 'calendarAll', 'admin', ['admin'], {
      calendars: ['read', 'write', 'delete'],
    }),
    new APIUser(10, 'calendarRead', 'read', ['user'], {
      calendars: ['read'],
    }),
    new APIUser(11, 'calendarWrite', 'write', ['user'], {
      calendars: ['write'],
    }),
    new APIUser(12, 'calendarDelete', 'delete', ['user'], {
      calendars: ['delete'],
    }),
    /* -------------------- event -------------------- */
    new APIUser(13, 'eventAll', 'admin', ['admin'], {
      events: ['read', 'write', 'delete'],
    }),
    new APIUser(14, 'eventRead', 'read', ['user'], {
      events: ['read'],
    }),
    new APIUser(15, 'eventWrite', 'write', ['user'], {
      events: ['write'],
    }),
    new APIUser(16, 'eventDelete', 'delete', ['user'], {
      events: ['delete'],
    }),
  ];

  async findOne(username: string): Promise<APIUser | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
