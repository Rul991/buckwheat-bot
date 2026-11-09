import DuelistService from "../../../../db/services/duel/DuelistService"
import DuelStepService from "../../../../db/services/duel/DuelStepService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default class ReturnDamageMethod extends SkillMethod {
    protected override _key: string = 'reaction/return-damage'
    coef: number

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const {
            chatId,
            target,
            boost
        } = options

        const step = await DuelStepService.getLastByDuelist(
            chatId,
            target.id
        )
        const damage = step?.damage ?? 0
        return Math.floor(damage * boost * this.coef)
    }

    protected override async _precheck(_options: MethodPreCheckOptions): Promise<boolean> {
        return true
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            data,
            chatId,
            target
        } = options

        if (data == 0) return
        await DuelistService.add({
            chatId,
            id: target.id,
            key: 'hp',
            value: -data
        })
    }

    constructor(coef: number) {
        super()
        this.coef = coef
    }
}