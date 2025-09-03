import Items from '../../../../interfaces/schemas/Items'
import ItemsRepository from '../../repositories/ItemsRepository'

export default class ItemsService {
    static async get(chatId: number, id: number): Promise<Items> {
        const foundItems = await ItemsRepository.findOne(chatId, id)

        if(!foundItems) return await ItemsRepository.create({chatId, id})
        else return foundItems
    }

    static async getAll(chatId: number): Promise<Items[]> {
        return await ItemsRepository.findManyInChat(chatId)
    }
}