import { SettingValueTypes } from "../../protos/settings_pb"
import Setting from "../../utils/settings/Setting"

const createRanksSetting = (id: number): Setting<'string', SettingValueTypes.Ranks> => {
    return new Setting({
        type: 'string',
        default: '',
        id,
        properties: {
            min: 0,
            max: 32
        },
        textKey: 'ranks/name',
        valueType: SettingValueTypes.Ranks,
    })
}

export const rankMinusOneSetting = createRanksSetting(0)
export const rankZeroSetting = createRanksSetting(1)
export const rankOneSetting = createRanksSetting(2)
export const rankTwoSetting = createRanksSetting(3)
export const rankThreeSetting = createRanksSetting(4)
export const rankFourSetting = createRanksSetting(5)
export const rankFiveSetting = createRanksSetting(6)

export const ranksSettings = [
    rankFiveSetting,
    rankFourSetting,
    rankThreeSetting,
    rankTwoSetting,
    rankOneSetting,
    rankZeroSetting,
    rankMinusOneSetting,
]