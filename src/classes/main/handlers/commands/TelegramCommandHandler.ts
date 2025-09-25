import { Telegraf } from 'telegraf'
import BaseHandler from '../BaseHandler'
import TelegramCommand from '../../../commands/base/TelegramCommand'
import { BotCommand } from 'telegraf/types'
import StringUtils from '../../../../utils/StringUtils'

export default class TelegramCommandHandler extends BaseHandler<TelegramCommand, TelegramCommand[], typeof TelegramCommand> {
    private _botCommands: BotCommand[]

    constructor() {
        super([], TelegramCommand)
        this._botCommands = []
    }

    setup(bot: Telegraf): void {
        for (const command of this._container) {
            this._botCommands.push(command.botCommand)
            bot.command(command.name, async ctx => {
                const [_, other] = StringUtils.splitByCommands(ctx.text, 1)
                await command.execute(ctx, other)
            })
        }

        bot.telegram.setMyCommands(this._botCommands)
    }
}