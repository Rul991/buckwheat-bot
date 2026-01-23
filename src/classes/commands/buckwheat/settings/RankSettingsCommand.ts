import { RANK_SETTINGS_TYPE } from '../../../../utils/values/consts'
import SettingsCommand from './SettingsCommand'

export default class extends SettingsCommand {
    constructor() {
        super()
        this._name = 'ранги'
        this._aliases = [
            'гниды'
        ]
        this._description = 'показываю названия для рангов'
        this._settingId = 'ranks-settings'
        this._userSettingsType = RANK_SETTINGS_TYPE
        this._chatSettingsType = RANK_SETTINGS_TYPE
    }
}