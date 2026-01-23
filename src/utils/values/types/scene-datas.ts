import Setting from '../../../interfaces/other/Setting'

export type SettingInputData<K extends 'string' | 'number'> = {
    settingId: string
    settingsId: number
    type: string
    setting?: Setting<K>
}