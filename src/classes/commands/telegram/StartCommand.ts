import TelegramCommand from '../base/TelegramCommand'
import MessageUtils from '../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'

export default class StartCommand extends TelegramCommand {
    constructor () {
        super()
        this._name = 'start'
        this._description = 'Команда для запуска бота'
    }

    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        const title = ctx.chat.type != 'private' ? ctx.chat.title : ctx.botInfo.first_name

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/other/start.pug',
            { changeValues: { title } }
        )
    }
}