import { MaybeString, TextContext } from '../../../../utils/values/types/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { DEV_ID } from '../../../../utils/values/consts'

export default class CreatorCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'создатель'
        this._description = 'повышаю твой ранг до Гниды, если ты являешься создателем беседы.'
        this._aliases = ['гнида']
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return
        let member = await ContextUtils.getChatMember(ctx, id)

        if(member?.status == 'creator' || id == DEV_ID) {
            await UserRankService.update(chatId, id, RankUtils.max)
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