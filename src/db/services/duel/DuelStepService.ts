import TimeUtils from "../../../utils/time/TimeUtils"
import type Duel from "../../entities/duel/Duel"
import DuelStep from "../../entities/duel/DuelStep"
import BaseService from "../base/BaseService"

class DuelStepService extends BaseService<typeof DuelStep> {
    constructor() {
        super(DuelStep)
    }

    async getCurrent(chatId: number) {
        return await this._repo.findOne(
            { chatId },
            {
                sort: {
                    _id: -1
                }
            }
        )
    }

    async deleteCurrent(chatId: number) {
        const result = await this._repo.model
            .deleteOne(
                {
                    chatId
                }
            )
            .sort({
                _id: -1
            })
            .exec()

        return result.deletedCount > 0
    }

    async addDamage(chatId: number, damage: number) {
        return await this._repo.updateOne(
            {
                chatId
            },
            {
                $inc: {
                    damage
                }
            },
            {
                sort: {
                    _id: -1
                }
            }
        )
    }

    async getElapsedTime(duel: Duel) {
        const chatId = duel.chatId
        const currentStep = await this.getCurrent(chatId)
        
        if(!currentStep) return TimeUtils.getElapsed(+duel.createdAt)
        return TimeUtils.getElapsed(+currentStep.createdAt)
    }

    async deleteByChatId(chatId: number) {
        const result = await this._repo.deleteMany({ chatId })
        return result.deletedCount > 0
    }

    async count(chatId: number) {
        return await this._repo.count({ chatId })
    }

    async getCurrentDuelist(duel: Duel | undefined): Promise<number> {
        if (!duel) return 0
        const chatId = duel.chatId

        const currentStep = await this.getCurrent(chatId)
        if (!currentStep) return duel.duelists[0]!

        return currentStep.duelist
    }

    async setNextDuelist(chatId: number, duelist: number) {
        return await this._repo.updateOne(
            {
                chatId
            },
            {
                nextDuelist: duelist
            },
            {
                sort: {
                    _id: -1
                }
            }
        )
    }
}

export default new DuelStepService()