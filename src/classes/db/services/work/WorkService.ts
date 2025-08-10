import Work from '../../../../interfaces/schemas/Work'
import WorkRepository from '../../repositories/WorkRepository'

export default class WorkService {
    static async get(id: number): Promise<Work> {
        const work = await WorkRepository.findOne(id)
        
        if(!work) return WorkRepository.create({id})
        else return work
    }
}