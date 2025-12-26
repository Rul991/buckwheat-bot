import ExportImportManager from '../../../../utils/ExportImportManager'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'импорт'
        this._description = 'позволяет импортировать некоторые данные\nИспользуется парно с "баквит экспорт"'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            id
        } = options

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/import/list.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.map(
                    'import/start',
                    {
                        values: {
                            import: ExportImportManager.getValues()
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