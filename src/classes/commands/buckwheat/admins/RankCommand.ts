import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'

export default class RankCommand extends BuckwheatCommand {
    private static async _answerMyRank(ctx: Context): Promise<void> {
        const rank = await UserRankService.get(ctx.from!.id)

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
        if(isNaN(+data)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rank/wrong.pug'
            )
            return true
        }

        return false
    }

    private static async _answerIfRankOutBounds(ctx: Context, rank: number): Promise<boolean> {
        if(!RankUtils.isRankInBounds(rank)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rank/out-bounds.pug'
            )
            return true
        }

        return false
    }

    private static async _answerIfNotAdmin(ctx: Context, rank: number): Promise<boolean> {
        if(rank < RankUtils.admin) {
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

        if((myRank < rank || myRank <= replyRank) && !isCreator) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/rank/low-rank.pug'
            )
            return true
        }

        return false
    }

    constructor() {
        super()
        this._name = 'ранг'
        this._description = 'изменяю ранг игрока в диапазоне от 0 до 5'
        this._needData = true
        this._replySupport = true
        this._argumentText = '0-5'
    }

    async execute(ctx: TextContext, data: MaybeString): Promise<void> {
        if(!ctx.message || !ctx.from || !ctx.chat) return

        if('reply_to_message' in ctx.message && data) {
            if(await RankCommand._answerIfWrongData(ctx, data)) return
            else {
                const reply = ctx.message.reply_to_message!
                const rank = +data
                
                const myId = ctx.from.id
                const replyId = reply.from?.id ?? 0

                if(await RankCommand._answerIfRankOutBounds(ctx, rank)) return
                
                const myRank = await UserRankService.get(myId)
                const replyRank = await UserRankService.get(replyId)

                if(await RankCommand._answerIfNotAdmin(ctx, myRank)) return
                if(await RankCommand._answerIfLowRank(ctx, myRank, rank, replyRank)) return

                const mode = replyRank <= rank ? 'up' : 'down'
                
                await UserRankService.update(replyId, rank)
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/rank/${mode}.pug`,
                    {
                        changeValues: {
                            ...await ContextUtils.getUser(replyId),
                            rank: RankUtils.getRankByNumber(rank),
                            emoji: RankUtils.getEmojiByRank(rank),
                        }
                    }
                )
            }
        }
        else {
            RankCommand._answerMyRank(ctx)
        }
    }
}