import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import SettingShowUtils from '../../../utils/settings/SettingShowUtils'

type Data = {
    n: string
    id: number
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _filename: string = 'chat'
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            n: {
                type: 'string'
            },
            id: {
                type: 'number'
            },
            p: {
                type: 'number'
            }
        },
        required: ['n', 'id', 'p']
    }

    constructor () {
        super()
        this._name = 'setsh'
    }
    async execute(ctx: CallbackButtonContext, data: Data): Promise<string | void> {
        const {
            n: settingId,
            id,
            p: page
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

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