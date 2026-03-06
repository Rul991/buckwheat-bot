import MathUtils from '../../../../utils/MathUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import SettingInputAction from './SettingInputAction'

export default class extends SettingInputAction<'date'> {
    protected _settingType: 'date' = 'date'

    protected _getValue(text: string, min: number, max: number): number {
        const value = TimeUtils.parseTimeToMilliseconds(text, true)
        return MathUtils.clamp(
            value,
            min,
            max
        )
    }
}