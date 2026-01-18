import LastStep from '../../../../interfaces/schemas/duels/LastStep'
import DuelRepository from '../../repositories/DuelRepository'
import DuelService from './DuelService'

export default class {
    static async set(id: number, lastStep: LastStep) {
        const duel = await DuelService.get(id)
        if(!duel) return null

        return await DuelRepository.updateOne(
            id,
            {
                step: {
                    lastStep,
                    duelist: duel.step.duelist
                }
            }
        )
    }

    static async get(id: number) {
        const duel = await DuelService.get(id)
        if(!duel) return null

        return duel.step.lastStep
    }
}