import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { EmptyButtonDataSchema, type EmptyButtonData } from "../../../../protos/proto_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import BalanceService from "../../../../db/services/money/BalanceService"
import RandomUtils from "../../../../utils/math/RandomUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class OpenRandomPrizeButton extends CallbackQueryAction<EmptyButtonData> {
    private readonly _award = {
        min: 0,
        max: 50,
        best: 100,
        bestKey: 1
    } as const

    override schema: GenMessage<EmptyButtonData> = EmptyButtonDataSchema
    override defaultTextKey: string = 'box/open-button'
    override minimumRank: number = RankUtils.min
    override settingId: number = 51
    override name: string = 'box'

    private _getMoney(botMoney: number): number {
        const availableMoney = Math.max(0, botMoney)
        const rawMoney = RandomUtils.range(
            this._award.min,
            this._award.max
        )
        const money = rawMoney == this._award.bestKey ?
            this._award.best :
            rawMoney

        return Math.min(money, availableMoney)
    }

    protected override async _execute(options: CallbackQueryActionOptions<EmptyButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            id,
            ctx
        } = options

        const botId = ctx.me.id
        const botBalance = await BalanceService.getUserBalance(chatId, botId)
        const botMoney = botBalance?.total ?? 0

        const user = ctx.vars.user
        const gift = this._getMoney(botMoney)

        await Promise.all([
            BalanceService.add({
                chatId,
                id,
                money: gift
            }),
            BalanceService.add({
                chatId,
                id: botId,
                money: -gift
            }),
            MessageUtils.reply(
                ctx,
                'box/opened',
                {
                    vars: {
                        user,
                        money: gift
                    }
                }
            )
        ])
        await MessageUtils.deleteMessages(ctx)
    }
}

export default new OpenRandomPrizeButton()