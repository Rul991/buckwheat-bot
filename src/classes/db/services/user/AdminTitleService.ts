import User from '../../../../interfaces/schemas/user/User'
import BaseUserService from './BaseUserService'

export default class {
    static async get(chatId: number, id: number): Promise<string | undefined> {
        return await BaseUserService.get(chatId, id, 'adminTitle') ?? undefined
    }

    static async update(chatId: number, id: number, adminTitle: User['adminTitle']) {
        return await BaseUserService.update(
            chatId,
            id,
            'adminTitle',
            adminTitle
        ) ?? undefined
    }
}