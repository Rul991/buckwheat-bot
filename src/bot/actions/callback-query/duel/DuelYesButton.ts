import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelYesButtonData, DuelYesButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import DuelistService from "../../../../db/services/duel/DuelistService"
import BalanceService from "../../../../db/services/money/BalanceService"
import UserService from "../../../../db/services/user/UserService"
import { DEAD_HEALTH } from "../../../../consts/number"
import DuelService from "../../../../db/services/duel/DuelService"
import type { BotContext } from "../../../../types/bot"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import Duel from "../../../../db/entities/duel/Duel"
import DuelPresenter from "../../../../utils/duel/duel/DuelPresenter"

type CanDuelOptions = {
    chatId: number
    id: number
    prize: number
}

type ReplyIfCantDuelOptions =
    & CanDuelOptions
    & {
        ctx: BotContext
    }

class DuelYesButton extends CallbackQueryAction<DuelYesButtonData> {
    override schema: GenMessage<DuelYesButtonData> = DuelYesButtonDataSchema
    override defaultTextKey: string = 'duel/button/yes'
    override minimumRank: number = RankUtils.min
    override settingId: number = 191
    override name: string = 'duelyes'

    protected override async _getId(options: CallbackQueryActionOptions<DuelYesButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.replyId)
    }

    private async _checkCanDuel(options: CanDuelOptions) {
        const {
            chatId,
            id,
            prize
        } = options

        const money = await BalanceService.getMoney(chatId, id)
        if (money < prize) {
            return {
                key: 'duel/message/cant-duel/no-money',
                vars: {
                    user: await UserService.get(chatId, id),
                    money,
                    prize
                }
            }
        }

        const duelist = await DuelistService.get(chatId, id)
        if (duelist.hp <= DEAD_HEALTH) {
            return {
                key: 'duel/message/cant-duel/no-hp',
                vars: {
                    user: await UserService.get(chatId, id),
                }
            }
        }
    }

    private async _replyIfCantDuel(options: ReplyIfCantDuelOptions) {
        const {
            ctx
        } = options
        const result = await this._checkCanDuel(options)

        if (result) {
            const {
                key,
                vars
            } = result

            await MessageUtils.reply(
                ctx,
                key,
                {
                    vars
                }
            )
        }

        return Boolean(result)
    }

    protected override async _execute(options: CallbackQueryActionOptions<DuelYesButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            id: replyId,
            chatId,
            ctx
        } = options

        const {
            prize
        } = data
        const suggesterId = Number(data.suggesterId)

        const {
            first: replyPrize,
            second: suggesterPrize,
            total: totalPrize
        } = await DuelService.getPrizes({
            chatId,
            first: replyId,
            second: suggesterId,
            prize: prize
        })

        const replyCanDuelResult = await this._replyIfCantDuel({
            chatId,
            id: replyId,
            prize: replyPrize,
            ctx
        })
        if (replyCanDuelResult) return

        const suggesterCanDuelResult = await this._replyIfCantDuel({
            chatId,
            id: suggesterId,
            prize: suggesterPrize,
            ctx
        })
        if (suggesterCanDuelResult) return

        const [duel] = await Promise.all([
            DuelService.create(
                new Duel({
                    duelists: [suggesterId, replyId],
                    chatId,
                    prize: totalPrize
                })
            ),
            BalanceService.addMany([
                {
                    chatId,
                    id: replyId,
                    income: -replyPrize
                },
                {
                    chatId,
                    id: suggesterId,
                    income: -suggesterPrize
                },
            ]),
            MessageUtils.deleteMessages(ctx)
        ])

        const {
            key,
            options: messageOptions
        } = await DuelPresenter.fight({
            ctx,
            duel
        })

        await MessageUtils.reply(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new DuelYesButton()
