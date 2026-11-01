import BalanceService from "../../../../db/services/money/BalanceService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default abstract class BaseMoneyMethod extends SkillMethod {
    protected abstract _getRawMoney(options: MethodGetDataOptions): Promise<number>

    protected override async _getData(options: MethodGetDataOptions): Promise<number> {
        const money = await this._getRawMoney(options)
        const {
            boost
        } = options
        return Math.floor(money * boost)
    }

    protected override async _precheck(options: MethodPreCheckOptions): Promise<boolean> {
        const {
            target,
            chatId,
            data: needMoney,
            ctx
        } = options
        const balance = ctx.vars.id != target.id ?
            await BalanceService.get(
                chatId,
                target.id
            ) :
            await ctx.vars.balance.get()

        return (balance?.total ?? 0) >= needMoney
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            data: money,
            chatId,
            target,
            caster,
            ctx
        } = options

        ctx.vars.balance.update()
        await BalanceService.transfer({
            chatId,
            owner: target.id,
            target: caster.id,
            money
        })
    }

}