import { MAX_DEBT_VALUE } from "../../consts/number"
import BalanceService from "../../db/services/money/BalanceService"
import type { BotContext } from "../../types/bot"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../types/duels"
import SkillMethod from "./SkillMethod"

export default class MoneyMethod extends SkillMethod {
    protected override _key: string = 'money'
    protected _money: number

    constructor(money: number) {
        super()
        this._money = money
    }

    protected async _getBalance(ctx: BotContext, id: number): Promise<number> {
        const chatId = ctx.vars.chatId!
        const balance = ctx.vars.id == id ?
            await ctx.vars.balance.get() :
            await BalanceService.getUserBalance(chatId, id)

        return balance?.total ?? 0
    }

    protected override async _getData(_options: MethodGetDataOptions): Promise<number> {
        return this._money
    }

    protected override async _precheck(options: MethodPreCheckOptions): Promise<boolean> {
        const {
            ctx,
            data: needMoney,
            id
        } = options

        const enemyMoney = await this._getBalance(ctx, id)
        return (enemyMoney - needMoney) >= MAX_DEBT_VALUE
    }

    protected override async _execute(options: MethodExecuteOptions): Promise<void> {
        const {
            data: money,
            id,
            chatId
        } = options

        await BalanceService.add({
            chatId,
            id,
            money
        })
    }

}