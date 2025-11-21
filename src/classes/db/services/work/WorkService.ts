import Work from '../../../../interfaces/schemas/user/Work'
import WorkRepository from '../../repositories/WorkRepository'

export default class WorkService {
    static async get(chatId: number, id: number): Promise<Work> {
        const work = await WorkRepository.findOne(chatId, id)
        
        if(!work) return WorkRepository.create({chatId, id})
        else return work
    }

    static async wipe(chatId: number): Promise<void> {
        await WorkRepository.updateMany(chatId, {
            $set: {
                lastWork: 0
            }
        })
    }
}