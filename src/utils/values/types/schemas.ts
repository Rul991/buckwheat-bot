import Setting from '../../../interfaces/other/Setting'
import { SettingType } from './types'

export type CommonSettingPart<T extends SettingType> = Omit<Setting<T>, 'type' | 'default' | 'properties'>
export type UniqueSettingPart<T extends SettingType> = Pick<Setting<T>, 'type' | 'properties' | 'default'>