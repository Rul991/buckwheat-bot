import FaqUtils from '../../../../utils/FaqUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'как'
        this._description = 'даю вам подсказки'
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
                inlineKeyboard: await InlineKeyboardManager.get(
                    'faq/start'
                )
            }
        )
    }
}