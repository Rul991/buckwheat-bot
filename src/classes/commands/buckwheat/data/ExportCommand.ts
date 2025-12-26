import ExportImportManager from '../../../../utils/ExportImportManager'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'экспорт'
        this._description = 'позволяет экспортировать некоторые данные из чата\nИспользуется парно с "баквит импорт"'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            id
        } = options

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/export/list.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.map(
                    'export/start',
                    {
                        values: {
                            export: ExportImportManager.getValues()
                                .map(({
                                    title,
                                    id: name
                                }) => {
                                    return {
                                        text: title,
                                        data: JSON.stringify({
                                            id,
                                            n: name
                                        })
                                    }
                                })
                        }
                    }
                )
            }
        )
    }
}