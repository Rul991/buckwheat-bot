import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import StringUtils from '../../../../utils/StringUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import HelloService from '../../../db/services/chat/HelloService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class HelloCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'приветствие'
        this._description = 'редактирую сообщение, которые отправляется при входе нового игрока'
        this._needData = true
        this._argumentText = 'текст приветствия'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const id = ctx.from.id
        const rank = await UserRankService.get(id)

        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/no-other.pug',
                {
                    changeValues: {
                        text: await HelloService.get()
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
        
        await HelloService.edit(other)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/hello/done.pug',
        )
    }
}