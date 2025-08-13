import Items from '../../../../interfaces/schemas/Items'
import ItemsRepository from '../../repositories/ItemsRepository'

export default class ItemsService {
    static async get(id: number): Promise<Items> {
        const foundItems = await ItemsRepository.findOne(id)

        if(!foundItems) return await ItemsRepository.create({id})
        else return foundItems
    }
}