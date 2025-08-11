import { Telegraf } from 'telegraf'
import BaseHandler from '../BaseHandler'
import ConditionalCommand from '../../../commands/base/ConditionalCommand'
import TelegramCommand from '../../../commands/base/TelegramCommand'
import { BotCommand } from 'telegraf/types'
import StringUtils from '../../../../utils/StringUtils'

export default class TelegramCommandHandler extends BaseHandler<TelegramCommand, TelegramCommand[]> {
    private _botCommands: BotCommand[]

    constructor() {
        super([])
        this._botCommands = []
    }

    setup(bot: Telegraf): void {
        for (const command of this._instances) {
            this._botCommands.push(command.botCommand)
            bot.command(command.name, async ctx => {
                const [_, ...other] = StringUtils.splitBySpace(ctx.text)
                await command.execute(ctx, other.join(' '))
            })
        }

        bot.telegram.setMyCommands(this._botCommands)
    }
}