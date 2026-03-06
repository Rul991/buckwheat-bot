import Setting from '../../../interfaces/other/Setting'
import { SettingInputType } from './types'

export type SettingInputData<K extends SettingInputType> = {
    settingId: string
    settingsId: number
    type: string
    setting?: Setting<K>
}