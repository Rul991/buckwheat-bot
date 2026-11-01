import DuelistService from "../../../../db/services/duel/DuelistService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default abstract class BaseDamageMethod extends SkillMethod {
    protected abstract _getRawDamage(options: MethodGetDataOptions): Promise<number>

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const damage = await this._getRawDamage(options)
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
        } = options
        
        if(data == 0) return
        target.duelist.set(
            await DuelistService.add({
                chatId,
                id: target.id,
                value: -data,
                key: 'hp'
            })
        )
    }

}