import MessageUtils from '../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import { MaybeString } from '../../../utils/values/types/types'
import { TextContext } from '../../../utils/values/types/contexts'
import TelegramCommand from '../base/TelegramCommand'

export default class PaySupportCommand extends TelegramCommand {
    constructor() {
        super()
        this._name = 'paysupport'
        this._isShow = false
    }

    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/other/paysupport.pug'
        )
    }
}