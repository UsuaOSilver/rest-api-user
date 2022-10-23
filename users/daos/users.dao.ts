import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import * as shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
    users: Array<CreateUserDto> = [];
    
    constructor() {
        log('Crerated new instance of UsersDao');
    }
    
    async addUser(user: CreateUserDto) {
        user.id = shortid.generate();
        this.users.push(user);
        return user.id;
    }
    async getUsers() {
        return this.users;
    }
    async getUserById(userId: string) {
        return this.users.find((user: { id: string }) => user.id === userId);
    }
    // put and patch has bug, will be address at db level.
    async putUserById(userId: string, user: PutUserDto) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId
        );
        this.users.splice(objIndex, 1, user);
        return `${user.id} updated via put`;
    }
    async patchUserById(userId: string, user: PatchUserDto) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId
        );
        let currentUser = this.users[objIndex];
        const allowedPatchFields = [
            'password',
            'firstName',
            'lastName',
            'permissionLevel',
        ];
        for (let field of allowedPatchFields) {
            if (field in user) {
                currentUser[field] = user[field];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return `${user.id} patched`;
    }
    async removeUserById(userId: string) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId
        );
        this.users.splice(objIndex, 1);
        return `${userId} removed`;
    }
}