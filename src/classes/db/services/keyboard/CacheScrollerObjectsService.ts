import CacheScrollerObjects from '../../../../interfaces/schemas/keyboard/CacheScrollerObjects'
import CacheScrollerObjectsRepository from '../../repositories/CacheScrollerObjectsRepository'

export default class {
    static async set(data: CacheScrollerObjects) {
        const {
            messageId,
            chatId
        } = data

        const filter = {
            messageId,
            chatId
        }

        return await CacheScrollerObjectsRepository.updateOne(
            {
                ...data,
                updatedAt: new Date()
            },
            filter,
        )
    }

    static async get(chatId: number, messageId: number) {
        const found = await CacheScrollerObjectsRepository.findOne({
            chatId,
            messageId
        })
        return found
    }
}