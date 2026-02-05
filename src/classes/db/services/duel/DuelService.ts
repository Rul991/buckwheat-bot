import Duel from '../../../../interfaces/schemas/duels/Duel'
import DuelStep from '../../../../interfaces/schemas/duels/DuelStep'
import DuelRepository from '../../repositories/DuelRepository'
import DuelStepService from './DuelStepService'

type OptionalDuel = Omit<Duel, 'id' | 'step'> & {
    id?: number,
    step?: DuelStep
}

export default class DuelService {
    static async create(data: OptionalDuel): Promise<Duel> {
        const id = await this.getNewIndex()
        return await DuelRepository.create({
            ...data,
            id,
            steps: [
                await DuelStepService.fromDuelists(data)
            ]
        })
    }

    static async getNewIndex() {
        return (await DuelRepository.getMaxId()) + 1
    }

    static async get(id: number): Promise<Duel | null> {
        return await DuelRepository.findOne(id)
    }

    static async delete(id: number): Promise<Duel | null> {
        return await DuelRepository.deleteOne(id)
    }

    static async getByUserId(chatId: number, id: number) {
        return await DuelRepository.findByFilter({
            chatId,
            $or: [
                {
                    firstDuelist: id
                },
                {
                    secondDuelist: id
                }
            ]
        })
    }
}