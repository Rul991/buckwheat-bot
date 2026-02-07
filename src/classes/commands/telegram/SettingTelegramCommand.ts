import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import TelegramCommand from '../base/TelegramCommand'
import SettingsCommand from '../buckwheat/settings/SettingsCommand'

export default class SettingTelegramCommand extends TelegramCommand {
    private static _command = new SettingsCommand()

    constructor() {
        super()
        this._name = 'settings'
        this._description = '⚙️ Настройки'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        return await SettingTelegramCommand._command.execute(options)
    }
}