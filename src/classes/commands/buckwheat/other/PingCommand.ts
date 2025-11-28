import { TelegramEmoji } from 'telegraf/types'
import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString, TextContext } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class PingCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'прием'
        this._aliases = [
            'приём',
            'пинг'
        ]
        this._description = 'прием-прием'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const reactionChance = await ChatSettingsService.get<'string'>(
            chatId, 
            'pingEmoji'
        ) ?? '🫡'

        await MessageUtils.react(ctx, reactionChance as TelegramEmoji)
    }
}