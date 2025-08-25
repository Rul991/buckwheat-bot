import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/values/types'
import UserLinkedService from '../../db/services/user/UserLinkedService'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class LinkCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'привязать'
        this._description = 'привязываю вас к этому чату\nпозволяю работать с ним из личных сообщений'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/private.pug'
            )
            return
        }

        if(ctx.chat.id == await UserLinkedService.get(ctx.from.id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/already.pug'
            )
            return
        }

        await UserLinkedService.update(ctx.from.id, ctx.chat.id)

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