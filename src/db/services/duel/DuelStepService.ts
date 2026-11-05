import DuelUtils from "../../../utils/duel/duel/DuelUtils"
import type Duel from "../../entities/duel/Duel"
import DuelStep from "../../entities/duel/DuelStep"
import BaseService from "../base/BaseService"

class DuelStepService extends BaseService<typeof DuelStep> {
    constructor() {
        super(DuelStep)
    }

    async getLast(chatId: number) {
        return await this._repo.model.findOne({ chatId })
            .sort({ _id: -1 })
            .lean()
            .exec()
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

        const lastStep = await this.getLast(chatId)
        if (!lastStep) return duel.duelists[0]!

        return DuelUtils.getEnemy(duel, lastStep.duelist)
    }
}

export default new DuelStepService()