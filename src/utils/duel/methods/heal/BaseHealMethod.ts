import DuelistService from "../../../../db/services/duel/DuelistService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default abstract class BaseHealMethod extends SkillMethod {
    protected abstract _getRawData(options: MethodGetDataOptions): Promise<number>

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const health = await this._getRawData(options)
        const {
            boost
        } = options
        return Math.floor(health * boost)
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

        if (data == 0) return
        await DuelistService.add({
            chatId,
            id: target.id,
            value: data,
            key: 'hp'
        })
    }

}