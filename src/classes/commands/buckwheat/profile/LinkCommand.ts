import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class LinkCommand extends BuckwheatCommand {
    protected _settingId: string = 'link'

    constructor() {
        super()
        this._name = 'привязать'
        this._description = 'привязываю вас к этому чату\nпозволяю работать с собой в личных сообщениях'
    }

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/private.pug'
            )
            return
        }

        if(chatId == await LinkedChatService.getRaw(id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/link/already.pug'
            )
            return
        }


        await LinkedChatService.set(id, chatId)

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