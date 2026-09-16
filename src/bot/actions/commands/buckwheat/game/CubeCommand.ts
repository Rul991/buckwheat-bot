import GameService from "../../../../../db/services/game/GameService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import CubeUtils from "../../../../../utils/cube/CubeUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import { cubeStartKeyboard } from "../../../../keyboards/cube"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class CubeCommand extends BuckwheatCommand {
    override aliases: string[] = ['кубики', 'дайсы', 'дайс']
    override minimumRank: number = RankUtils.min
    override settingId: number = 52
    override name: string = 'кубы'
    override filename: string = 'cubes'
    override isSupportReply: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            replyFrom,
            chatId,
            other = '',
            ctx,
            id,
        } = options

        if (!replyFrom) {
            return {
                key: 'cube/no-reply',
                options: {
                    vars: {
                        other
                    }
                }
            }
        }

        const rawBet = StringUtils.getNumberFromString(other, 0)
        const firstUserMoney = ctx.vars.balance?.total ?? 0

        const bet = CubeUtils.getBet(rawBet, firstUserMoney)
        const canPlay = CubeUtils.checkBalance(rawBet, firstUserMoney)

        if (!canPlay) {
            return {
                key: 'cube/negative-bet',
            }
        }

        const replyIsBot = replyFrom.is_bot
        const firstId = replyIsBot ? replyFrom.id : id
        const secondId = replyIsBot ? id : replyFrom.id

        const firstUser = await UserService.get(chatId, firstId)
        const secondUser = await UserService.get(chatId, secondId)

        const type = 'cube'
        await GameService.deleteMessage({
            ctx,
            chatId,
            id: firstId,
            type
        })

        const message = await MessageUtils.reply(
            ctx,
            'cube/start',
            {
                vars: {
                    bet,
                    first: firstUser,
                    second: secondUser
                },
                keyboard: await cubeStartKeyboard(ctx, {
                    first: firstId,
                    second: secondId,
                    bet
                })
            }
        )

        await GameService.start({
            type,
            chatId,
            id: firstId,
            messageId: message?.message_id
        })
    }
}