import { ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import ExportImportManager from '../../../utils/ExportImportManager'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'
import { MAX_EXPORT_DATA_LENGTH } from '../../../utils/values/consts'
import { dataSchema } from '../../../utils/values/schemas'
import RankUtils from '../../../utils/RankUtils'

type Data = {
    id: number,
    n: string
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle: string = 'Экспорт'
    protected _schema: ZodType<Data> = dataSchema

    constructor () {
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
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const {
            exported,
            value
        } = await ExportImportManager.export({
            chatId,
            id,
            name
        })

        const isEditMessage = exported.length <= MAX_EXPORT_DATA_LENGTH

        const text = await FileUtils.readPugFromResource(
            'text/commands/export/done.pug',
            {
                changeValues: {
                    title: value?.title,
                    result: isEditMessage ? exported : ''
                }
            }
        )

        if (isEditMessage) {
            await MessageUtils.editText(
                ctx,
                text
            )
        }
        else {
            await MessageUtils.answerTextAsFile(
                ctx,
                {
                    filename: value ? `${value.id}.json` : undefined,
                    text: exported
                },
                {
                    caption: text
                }
            )
            await MessageUtils.deleteMessage(ctx)
        }
    }

}