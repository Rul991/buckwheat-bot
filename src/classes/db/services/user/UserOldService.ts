import BaseUserService from './BaseUserService'

export default class UserOldService {
    static async get(id: number): Promise<boolean> {
        return await BaseUserService.get<boolean>(id, 'isOld') ?? false
    }

    static async update(id: number, isOld: boolean): Promise<boolean> {
        return await BaseUserService.update(id, 'isOld', isOld) ?? false
    }
}