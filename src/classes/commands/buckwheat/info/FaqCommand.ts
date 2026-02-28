import FaqUtils from '../../../../utils/FaqUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'faq'

    constructor() {
        super()
        this._name = 'как'
        this._description = 'даю вам различные подсказки (FAQ)'
        this._aliases = [
            'чаво',
            'помоги',
            'помощь'
        ]
    }

    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        const files = await FaqUtils.getFilenames()
        const length = files.length

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/faq/commands/list.pug',
            {
                changeValues: {
                    length
                },
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'faq/start'
                )
            }
        )
    }
}