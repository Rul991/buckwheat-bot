import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'

export default class CreatorCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'создатель'
        this._description = 'повышаю твой ранг до Гниды, если ты являешься создателем беседы.'
        this._aliases = ['гнида']
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return
        let member = await ContextUtils.getChatMember(ctx, ctx.from.id)

        if(member?.status == 'creator') {
            await UserRankService.update(chatId, ctx.from.id, RankUtils.max)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/creator/done.pug',
                {
                    changeValues: {
                        rank: RankUtils.getRankByNumber(RankUtils.max)
                    }
                }
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/creator/error.pug'
        )
    }
}