import ExportImportManager from '../../../../utils/ExportImportManager'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default abstract class extends BuckwheatCommand {
    protected abstract _filename: string

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            id
        } = options

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/${this._filename}/list.pug`,
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.map(
                    `${this._filename}/start`,
                    {
                        values: {
                            [this._filename]: ExportImportManager.getValues()
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