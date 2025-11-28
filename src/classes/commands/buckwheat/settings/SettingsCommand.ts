import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'настройки'
        this._description = 'показываю доступные вам настройки'
        this._aliases = [
            'настрой',
            'настроить',
            'конфиг'
        ]
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const settings = await ChatSettingsService.getAll(chatId)
        const settingsLength = settings.length

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/settings/done.pug',
            {
                changeValues: {
                    settingsLength 
                },
                inlineKeyboard: await InlineKeyboardManager.get('settings/start', `${id}`)
            }
        )
    }
}