import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { DEFAULT_SETTINGS_TYPE, DEFAULT_USER_SETTINGS_TYPE } from '../../../../utils/values/consts'
import SettingsService from '../../../db/services/settings/SettingsService'
import SettingUtils from '../../../../utils/settings/SettingUtils'

export default class extends BuckwheatCommand {
    constructor () {
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
        const type = ctx.chat.type == 'private' ? DEFAULT_USER_SETTINGS_TYPE : DEFAULT_SETTINGS_TYPE
        const settingsId = SettingUtils.getSettingsId(chatId, id, type)
        const settings = await SettingsService.getSettingsArray(settingsId, type)
        const settingsLength = settings.length

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/settings/done.pug',
            {
                changeValues: {
                    settingsLength
                },
                inlineKeyboard: await InlineKeyboardManager.get('settings/start', {
                    id,
                    type: JSON.stringify(type)
                })
            }
        )
    }
}