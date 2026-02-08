import Duel from '../../../../interfaces/schemas/duels/Duel'
import DuelStep from '../../../../interfaces/schemas/duels/DuelStep'
import ArrayUtils from '../../../../utils/ArrayUtils'
import DuelStepUtils from '../../../../utils/duel/DuelStepUtils'
import DuelUtils from '../../../../utils/duel/DuelUtils'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import { DuelistsWithChatId, FromDuelistsExtra } from '../../../../utils/values/types/duels'
import DuelRepository from '../../repositories/DuelRepository'
import DuelistService from '../duelist/DuelistService'
import DuelService from './DuelService'

export default class {
    static async add(id: number, step: DuelStep) {
        const duel = await DuelService.get(id)
        if (!duel) return null

        return await DuelRepository.updateOne(
            id,
            {
                $push: {
                    steps: step
                }
            }
        )
    }

    static async get(id: number) {
        const duel = await DuelService.get(id)
        return DuelStepUtils.get(duel)
    }

    static async getCurrent(id: number) {
        const steps = await this.get(id)
        return DuelStepUtils.getCurrent(steps)
    }

    static async updateCurrent(id: number, step: Partial<DuelStep>) {
        const steps = await this.get(id)
        const currentStepIndex = ArrayUtils.getLastIndex(steps)
        if (currentStepIndex == NOT_FOUND_INDEX) return false

        const currentStep = steps[currentStepIndex]
        const updatedStep = {
            ...currentStep,
            ...step
        }

        steps[currentStepIndex] = updatedStep
        await DuelRepository.updateOne(
            id,
            {
                steps
            }
        )
        return true
    }

    static async fromDuelists(duel: Duel, extra?: FromDuelistsExtra): Promise<DuelStep> {
        const {
            firstDuelist,
            secondDuelist,
            chatId
        } = duel
        
        const duelist = extra?.duelist ?? DuelStepUtils.getOther(duel)
        const characteristics: DuelStep['characteristics'] = new Map()

        characteristics.set(`${firstDuelist}`, await DuelistService.getCurrentCharacteristics(chatId, firstDuelist))
        characteristics.set(`${secondDuelist}`, await DuelistService.getCurrentCharacteristics(chatId, secondDuelist))

        return {
            ...extra,
            duelist,
            characteristics,
        }
    }
}