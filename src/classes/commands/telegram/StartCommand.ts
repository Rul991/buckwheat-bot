import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import ContextUtils from '../../../utils/ContextUtils'
import TelegramCommand from '../base/TelegramCommand'

export default class StartCommand extends TelegramCommand {
    constructor() {
        super()
        this._name = 'start'
        this._description  = 'Команда для запуска бота'
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await ContextUtils.answerMessageFromResource(ctx, 'text/commands/start.html')
    }
}