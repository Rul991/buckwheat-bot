import { BUTTON_ACCESS_TYPE } from '../../../../utils/values/consts'
import SettingsCommand from './SettingsCommand'

export default class extends SettingsCommand {
    constructor() {
        super()
        this._name = 'кнопки'
        this._aliases = [
            'дб',
            'кнопка'
        ]
        this._description = 'показываю и позволяю редактировать ранг для кнопок'
        this._settingId = 'button-access'
        this._userSettingsType = BUTTON_ACCESS_TYPE
        this._chatSettingsType = BUTTON_ACCESS_TYPE
    }
}