import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class LinkCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'привязать'
        this._description = 'привязываю вас к этому чату\nпозволяю работать с собой в личных сообщениях'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/private.pug'
            )
            return
        }

        if(ctx.chat.id == await LinkedChatService.getRaw(ctx.from.id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/already.pug'
            )
            return
        }

        await LinkedChatService.set(ctx.from.id, ctx.chat.id)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/link/done.pug',
            {
                changeValues: {
                    title: ctx.chat.title
                }
            }
        )
    }
}