import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class GetAwardCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'награды'
        this._aliases = [
            'медали',
            'заслуги'
        ]
        this._description = 'показываю все твои награды'
    }

    private _getId(ctx: TextContext): number {
        return ctx.message.reply_to_message?.from?.id ?? ctx.from.id
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = this._getId(ctx)
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const user = await ContextUtils.getUser(chatId, id)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/award/start-get.pug',
            {
                changeValues: {user},
                inlineKeyboard: await InlineKeyboardManager.get('awards/start', `${id}`)
            }
        )
    }
}