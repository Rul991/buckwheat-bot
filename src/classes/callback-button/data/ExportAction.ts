import { JSONSchemaType } from 'ajv'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import ExportImportManager from '../../../utils/ExportImportManager'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'

type Data = {
    id: number,
    n: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        required: ['id', 'n'],
        properties: {
            id: {
                type: 'number'
            },
            n: {
                type: 'string'
            }
        }
    }

    constructor() {
        super()
        this._name = 'export'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            chatId,
            data,
            ctx
        } = options

        const {
            n: name,
            id
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const {
            exported,
            value
        } = await ExportImportManager.export({
            chatId,
            id,
            name
        })

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/export/done.pug',
                {
                    changeValues: {
                        title: value?.title,
                        result: exported
                    }
                }
            )
        )
    }

}