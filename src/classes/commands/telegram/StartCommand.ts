import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/types'
import ContextUtils from '../../../utils/ContextUtils'
import TelegramCommand from '../base/TelegramCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class StartCommand extends TelegramCommand {
    constructor() {
        super()
        this._name = 'start'
        this._description  = 'Команда для запуска бота'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const title = ctx.chat.type != 'private' ? ctx.chat.title : ctx.botInfo.first_name

        await MessageUtils.answerMessageFromResource(
            ctx, 
            'text/commands/other/start.pug',
            {changeValues: {title}}
        )
    }
}