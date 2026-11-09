import DuelistService from "../../../../db/services/duel/DuelistService"
import DuelStepService from "../../../../db/services/duel/DuelStepService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default abstract class BaseDamageMethod extends SkillMethod {
    protected abstract _getRawData(options: MethodGetDataOptions): Promise<number>

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const damage = await this._getRawData(options)
        const {
            boost
        } = options
        return Math.floor(damage * boost)
    }

    protected override async _precheck(_options: MethodPreCheckOptions): Promise<boolean> {
        return true
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            data,
            chatId,
            target,
            caster,
            ctx,
        } = options

        if (data == 0) return
        const [
            _duelist,
            step
        ] = await Promise.all([
            DuelistService.add({
                chatId,
                id: target.id,
                value: -data,
                key: 'hp'
            }),
            DuelStepService.addDamage(
                chatId,
                caster.id,
                data
            )
        ])
        ctx.vars.duel.currentStep.set(step)
    }
}