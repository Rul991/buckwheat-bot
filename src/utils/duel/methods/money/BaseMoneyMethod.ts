import BalanceService from "../../../../db/services/money/BalanceService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default abstract class BaseMoneyMethod extends SkillMethod {
    protected abstract _getRawMoney(options: MethodGetDataOptions): Promise<number>

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const money = await this._getRawMoney(options)
        const {
            boost,
            target
        } = options

        const fullMoney = Math.floor(money * boost)
        const availableMoney = (await target.balance.require()).total

        return Math.min(fullMoney, availableMoney)
    }

    protected override async _precheck(_options: MethodPreCheckOptions): Promise<boolean> {
        return true
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            data: money,
            chatId,
            target,
            caster,
        } = options

        await BalanceService.transfer({
            chatId,
            owner: target.id,
            target: caster.id,
            money
        })
    }

}