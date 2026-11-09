import DuelStepService from "../../../../db/services/duel/DuelStepService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default class NextStepMethod extends SkillMethod {
    protected override _key: string = 'control/next-step'

    protected override async _getData(_options: MethodGetDataOptions): Promise<number> {
        return 0
    }
    
    protected override async _precheck(_options: MethodPreCheckOptions): Promise<boolean> {
        return true
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            target,
            chatId,
            ctx
        } = options

        ctx.vars.duel.currentStep.set(
            await DuelStepService.setNextDuelist(
                chatId,
                target.id
            )
        )
        ctx.vars.duel.currentDuelist.update()
    }
}