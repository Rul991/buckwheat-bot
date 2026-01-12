import { number, object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import SettingShowUtils from '../../../utils/settings/SettingShowUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'

type Data = {
    n: string
    id: number
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _filename: string = 'chat'
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            n: string(),
            p: number()
        }))

    constructor () {
        super()
        this._name = 'setsh'
    }
    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            n: settingId,
            id,
            p: page
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        return await SettingShowUtils.editMessage({
            filename: this._filename,
            chatId,
            id,
            page,
            settingId,
            ctx
        })
    }

}