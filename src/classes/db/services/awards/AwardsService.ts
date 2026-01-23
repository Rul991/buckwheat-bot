import Award from '../../../../interfaces/schemas/awards/Award'
import Awards from '../../../../interfaces/schemas/awards/Awards'
import AwardsRepository from '../../repositories/AwardsRepository'

export default class AwardsService {
    static async get(chatId: number, id: number): Promise<Awards> {
        const awards = await AwardsRepository.findOne(chatId, id)
        if(awards) return awards
        else return await AwardsRepository.create({chatId, id})
    }

    static async add(chatId: number, id: number, award: Award): Promise<Awards> {
        const awards = await this.get(chatId, id)
        const newAwards = [...(awards?.awards ?? []), award]

        return await AwardsRepository.updateOne(chatId, id, {awards: newAwards}) ?? awards
    }

    static async deleteChat(chatId: number) {
        return await AwardsRepository.deleteAllInChat(chatId)
    }
}