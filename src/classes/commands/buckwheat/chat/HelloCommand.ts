import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import HelloService from '../../../db/services/chat/HelloService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class HelloCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'приветствие'
        this._description = 'редактирую сообщение, которые отправляется при входе нового игрока'
        this._needData = true
        this._argumentText = 'текст приветствия'
        this._aliases = [
            'привет',
        ]
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return
        
        const rank = await UserRankService.get(chatId, id)

        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/no-other.pug',
                {
                    changeValues: {
                        text: await HelloService.get(chatId)
                    }
                }
            )
            return
        }

        if(rank < RankUtils.moderator) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/low-rank.pug',
            )
            return
        }
        
        await HelloService.edit(chatId, other)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/hello/done.pug',
        )
    }
}