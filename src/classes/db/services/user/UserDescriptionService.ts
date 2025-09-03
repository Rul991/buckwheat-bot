import BaseUserService from './BaseUserService'

export default class UserDescriptionService {
    static async get(chatId: number, id: number): Promise<string | null> {
        return (await BaseUserService.get<string>(chatId, id, 'description'))
    }

    static async update(chatId: number, id: number, description: string): Promise<string | null> {
        return (await BaseUserService.update(chatId, id, 'description', description))
    }
}