import KeyboardSchema from '../../../../interfaces/schemas/keyboard/KeyboardSchema'
import KeyboardRepository from '../../repositories/KeyboardRepository'

export default class {
    static async create(data: Omit<KeyboardSchema, 'createdAt'>): Promise<KeyboardSchema> {
        const {
            id,
            messageId,
            keyboard,
            chatId
        } = data

        const foundData = {
            id,
            messageId,
            chatId
        }

        const found = await this.get(foundData)
        if(found) {
            await KeyboardRepository.updateOneByFilter(
                foundData,
                {
                    keyboard
                }
            )
            return {
                ...data,
                createdAt: found.createdAt
            }
        }
        else {
            return await KeyboardRepository.create({
                ...data,
                createdAt: new Date()
            })
        }
    }

    static async get(data: Omit<KeyboardSchema, 'createdAt' | 'keyboard'>): Promise<KeyboardSchema | null> {
        return await KeyboardRepository.findByFilter(data)
    }
}