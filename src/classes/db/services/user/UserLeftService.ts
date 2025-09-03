import BaseUserService from './BaseUserService'

export default class UserLeftService {
    static async get(chatId: number, id: number): Promise<boolean | null> {
        return (await BaseUserService.get<boolean>(chatId, id, 'isLeft'))
    }

    static async update(chatId: number, id: number, left: boolean): Promise<boolean | null> {
        return (await BaseUserService.update(chatId, id, 'isLeft', left))
    }
}