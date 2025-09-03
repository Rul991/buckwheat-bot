import BaseUserService from './BaseUserService'

export default class UserOldService {
    static async get(chatId: number, id: number): Promise<boolean> {
        return await BaseUserService.get<boolean>(chatId, id, 'isOld') ?? false
    }

    static async update(chatId: number, id: number, isOld: boolean): Promise<boolean> {
        return await BaseUserService.update(chatId, id, 'isOld', isOld) ?? false
    }
}