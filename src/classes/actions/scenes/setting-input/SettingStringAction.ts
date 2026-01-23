import { FIRST_INDEX } from '../../../../utils/values/consts'
import { SettingTypeDefault } from '../../../../utils/values/types/types'
import SettingInputAction from './SettingInputAction'

export default class extends SettingInputAction<'string'> {
    protected _settingType: 'string' = 'string'

    protected _getValue(text: string, min: number, max: number): SettingTypeDefault['string'] {
        if (text.length < min) {
            return text.padEnd(min)
        }
        else if (text.length > max) {
            return text.substring(FIRST_INDEX, max)
        }

        return text
    }

    constructor () {
        super()
        this._name = 'setting-string'
    }
}