import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { DEFAULT_SETTINGS_TYPE, DEFAULT_USER_SETTINGS_TYPE } from '../../../../utils/values/consts'
import SettingsService from '../../../db/services/settings/SettingsService'
import SettingUtils from '../../../../utils/settings/SettingUtils'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'settings'
    protected _userSettingsType = DEFAULT_USER_SETTINGS_TYPE
    protected _chatSettingsType = DEFAULT_SETTINGS_TYPE

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
        const type = ctx.chat.type == 'private' ? this._userSettingsType : this._chatSettingsType
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
                inlineKeyboard: await LegacyInlineKeyboardManager.get('settings/start', {
                    id,
                    type: JSON.stringify(type)
                })
            }
        )
    }
}