import AvaHistory from '../../../../interfaces/schemas/user/AvaHistory'
import User from '../../../../interfaces/schemas/user/User'
import BaseUserService from './BaseUserService'

export default class AvaHistoryService {
    static async get(chatId: number, id: number): Promise<AvaHistory[]> {
        return await BaseUserService.get(chatId, id, 'avaHistory') ?? []
    }

    static async update(chatId: number, id: number, history: User['avaHistory'] & {}) {
        return await BaseUserService.update(
            chatId,
            id,
            'avaHistory',
            history
        )
    }

    static async add(chatId: number, id: number, imageId: string) {
        const history = await this.get(chatId, id)
        history.push({
            imageId,
            createdAt: Date.now()
        })

        return await this.update(chatId, id, history)
    }
}