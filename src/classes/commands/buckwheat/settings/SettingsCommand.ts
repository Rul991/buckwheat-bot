import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
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

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
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