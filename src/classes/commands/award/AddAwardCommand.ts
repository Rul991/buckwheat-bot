import ContextUtils from '../../../utils/ContextUtils'
import MathUtils from '../../../utils/MathUtils'
import MessageUtils from '../../../utils/MessageUtils'
import RankUtils from '../../../utils/RankUtils'
import StringUtils from '../../../utils/StringUtils'
import { TextContext, MaybeString } from '../../../utils/values/types/types'
import AwardsService from '../../db/services/awards/AwardsService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserRankService from '../../db/services/user/UserRankService'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class AddAwardCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'наградить'
        this._aliases = [
            'награда',
            'вознаградить',
            'награди'
        ]
        this._description = 'награждаю игрока'
        this._replySupport = true
        this._needData = true
        this._argumentText = '<0-8> <текст>'
    }

    private _getReplyId(ctx: TextContext): number | undefined {
        return ctx.message.reply_to_message?.from?.id
    }

    private _getValuesFromOther(ctx: TextContext, other?: string): [number, string] | null {
        const [rawLevel, text] = StringUtils.splitByCommands(other ?? '', 1)
        const level = +rawLevel

        if(!other || isNaN(level)) {
            return null
        }

        return [level, text]
    }

    private async _hasEnoughRank(chatId: number, id: number): Promise<boolean> {
        const rank = await UserRankService.get(chatId, id)
        return rank >= RankUtils.moderator
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const replyId = this._getReplyId(ctx)

        if(!replyId) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/award/no-reply.pug'
            )
            return
        }

        if(replyId == ctx.from.id) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/award/self.pug'
            )
            return
        }
        
        const values = this._getValuesFromOther(ctx, other)
        if(!values) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/award/wrong.pug'
            )
            return
        }
        const [level, text] = values
        const rank = MathUtils.clamp(level, 1, 8)
        
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        if(!await this._hasEnoughRank(chatId, id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/award/rank-issue.pug'
            )
            return
        }

        await AwardsService.add(chatId, replyId, {
            rank,
            text
        })

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/award/added.pug', {
                changeValues: {
                    level: rank,
                    reply: await ContextUtils.getUser(chatId, replyId),
                    user: await ContextUtils.getUser(chatId, id)
                }
            }
        )
    }
}