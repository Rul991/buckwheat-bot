import { COMMAND_ACCESS_TYPE } from '../../../../utils/values/consts'
import SettingsCommand from './SettingsCommand'

export default class extends SettingsCommand {
    constructor() {
        super()
        this._name = 'доступ'
        this._aliases = [
            'дк'
        ]
        this._description = 'показываю и позволяю редактировать ранг для команд'
        this._settingId = 'access'
        this._userSettingsType = COMMAND_ACCESS_TYPE
        this._chatSettingsType = COMMAND_ACCESS_TYPE
    }
}