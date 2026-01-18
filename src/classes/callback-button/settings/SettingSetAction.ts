import { boolean, number, object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import RankUtils from '../../../utils/RankUtils'
import ContextUtils from '../../../utils/ContextUtils'
import UserRankService from '../../db/services/user/UserRankService'
import FileUtils from '../../../utils/FileUtils'
import { DEFAULT_SETTINGS_TYPE, SET_NUMBER_PHRASE, SET_STRING_PHRASE } from '../../../utils/values/consts'
import StringUtils from '../../../utils/StringUtils'
import SettingShowUtils from '../../../utils/settings/SettingShowUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'
import SettingUtils from '../../../utils/settings/SettingUtils'
import SettingsService from '../../db/services/settings/SettingsService'

type Data = {
    id: number
    n: string
    v: boolean | number | string
    p?: number
    t?: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            n: string(),
            v: boolean()
                .or(string())
                .or(number()),
            p: number().optional(),
            t: string().optional()
        }))
    protected _minimumRank: number = RankUtils.max

    constructor () {
        super()
        this._name = 'set'
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id,
            n: settingId,
            v: value,
            p: page,
            t: type = DEFAULT_SETTINGS_TYPE
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return
        if (!(SettingUtils.isForUser(type) || await UserRankService.has(chatId, id, this._minimumRank))) {
            return await FileUtils.readPugFromResource(
                'text/other/rank-issue.pug',
                {
                    changeValues: {
                        rank: this._minimumRank
                    }
                }
            )
        }

        const settingsId = SettingUtils.getSettingsId(chatId, id, type)
        const initialState = {
            settingId,
            settingsId,
            type,
            isNumber: value == SET_NUMBER_PHRASE
        }

        if (value == SET_NUMBER_PHRASE || value == SET_STRING_PHRASE) {
            await ctx.scene.enter(
                'setting-input',
                initialState
            )
        }
        else {
            await SettingsService.setSetting(settingsId, type, settingId, value)
            await SettingShowUtils.editMessage({
                settingsId,
                id,
                settingId,
                ctx,
                page,
                filename: type
            })

            return await FileUtils.readPugFromResource(
                'text/commands/settings/set-value.pug',
                {
                    changeValues: {
                        value: StringUtils.getShowValue(value)
                    }
                }
            )
        }
    }
}