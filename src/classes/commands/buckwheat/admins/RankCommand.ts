import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class RankCommand extends BuckwheatCommand {
    private static async _answerMyRank(ctx: Context, chatId: number, userId: number): Promise<void> {
        const rank = await UserRankService.get(chatId, userId)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/rank/my.pug',
            {
                changeValues: {
                    rank: rank.toString(),
                    nameRank: RankUtils.getRankByNumber(rank)
                }
            }
        )
    }

    private static async _answerIfWrongData(ctx: Context, data: string): Promise<boolean> {
        if (isNaN(+data)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rank/wrong.pug'
            )
            return true
        }

        return false
    }

    private static async _answerIfRankOutBounds(ctx: Context, rank: number): Promise<boolean> {
        if (!RankUtils.isRankInBounds(rank)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rank/out-bounds.pug'
            )
            return true
        }

        return false
    }

    private static async _answerIfNotAdmin(ctx: Context, rank: number): Promise<boolean> {
        if (rank < RankUtils.admin) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rank/not-admin.pug'
            )
            return true
        }

        return false
    }

    private static async _answerIfLowRank(ctx: Context, myRank: number, rank: number, replyRank: number): Promise<boolean> {
        const isCreator = await ContextUtils.isCreator(ctx)

        if ((myRank < rank || myRank <= replyRank) && !isCreator) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rank/low-rank.pug'
            )
            return true
        }

        return false
    }

    constructor () {
        super()
        this._name = 'ранг'
        this._description = 'изменяю ранг игрока в диапазоне от 0 до 5'
        this._needData = true
        this._replySupport = true
        this._argumentText = '0-5'
    }

    async execute({ ctx, other: data, chatId, id: myId, replyFrom }: BuckwheatCommandOptions): Promise<void> {
        if (data) {
            if (await RankCommand._answerIfWrongData(ctx, data)) return
            else {
                const replyId = replyFrom?.id ?? 0
                const rank = +data

                if (await RankCommand._answerIfRankOutBounds(ctx, rank)) return

                const myRank = await UserRankService.get(chatId, myId)
                const replyRank = await UserRankService.get(chatId, replyId)

                if (await RankCommand._answerIfNotAdmin(ctx, myRank)) return
                if (await RankCommand._answerIfLowRank(ctx, myRank, rank, replyRank)) return

                const mode = replyRank <= rank ? 'up' : 'down'

                await UserRankService.update(chatId, replyId, rank)
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/rank/${mode}.pug`,
                    {
                        changeValues: {
                            ...await ContextUtils.getUser(chatId, replyId),
                            rank: RankUtils.getRankByNumber(rank),
                            emoji: RankUtils.getEmojiByRank(rank),
                        }
                    }
                )
            }
        }
        else {
            RankCommand._answerMyRank(ctx, chatId, myId)
        }
    }
}