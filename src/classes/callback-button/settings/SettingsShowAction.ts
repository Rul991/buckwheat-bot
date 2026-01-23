import { number, object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import SettingShowUtils from '../../../utils/settings/SettingShowUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'
import SettingUtils from '../../../utils/settings/SettingUtils'
import { DEFAULT_SETTINGS_TYPE } from '../../../utils/values/consts'

type Data = {
    n: string
    id: number
    p: number
    t?: string
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle: string = 'Настройки: Просмотр'
    protected _canBeUseInPrivateWithoutRank: boolean = true
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            n: string(),
            p: number(),
            t: string().optional()
        }))

    constructor () {
        super()
        this._name = 'setsh'
    }
    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            n: settingId,
            id,
            p: page,
            t: type = DEFAULT_SETTINGS_TYPE
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        return await SettingShowUtils.editMessage({
            filename: type,
            settingsId: SettingUtils.getSettingsId(chatId, id, type),
            id,
            page,
            settingId,
            ctx
        })
    }

}