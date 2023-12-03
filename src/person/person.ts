/* eslint-disable prettier/prettier */
export class Person {
    id: number;
    username: string;
    password: string;
    roles: string[];
    permissions: { [key: string]: string[] };

 
    constructor(id: number, username: string, password: string, roles: string[], permissions: {[key: string]: string[]}) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.permissions = permissions;
    }
}

