import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/values/types'
import TelegramCommand from '../base/TelegramCommand'

export default class PaySupportCommand extends TelegramCommand {
    constructor() {
        super()
        this._name = 'paysupport'
        this._isShow = false
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/other/paysupport.pug'
        )
    }
}