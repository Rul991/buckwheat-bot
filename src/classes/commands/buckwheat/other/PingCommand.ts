import { TelegramEmoji } from 'telegraf/types'
import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

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

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const reactionChance = await ChatSettingsService.get<'string'>(
            chatId, 
            'pingEmoji'
        ) ?? '🫡'

        await MessageUtils.react(ctx, reactionChance as TelegramEmoji)
    }
}