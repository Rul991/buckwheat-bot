import MathUtils from '../../../../utils/MathUtils'
import StringUtils from '../../../../utils/StringUtils'
import { SettingTypeDefault } from '../../../../utils/values/types/types'
import SettingInputAction from './SettingInputAction'

export default class extends SettingInputAction<'number'> {
    protected _settingType: 'number' = 'number'

    protected _getValue(text: string, min: number, max: number): SettingTypeDefault['number'] {
        const rawNumber = StringUtils.getNumberFromString(text)
        const value = MathUtils.clamp(
            rawNumber,
            min,
            max
        )

        return value
    }

    constructor() {
        super()
        this._name = 'setting-number'
    }
}