import Work from '../../../../interfaces/schemas/Work'
import WorkRepository from '../../repositories/WorkRepository'

export default class WorkService {
    static async get(chatId: number, id: number): Promise<Work> {
        const work = await WorkRepository.findOne(chatId, id)
        
        if(!work) return WorkRepository.create({chatId, id})
        else return work
    }
}