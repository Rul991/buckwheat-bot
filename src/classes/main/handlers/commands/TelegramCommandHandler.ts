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

    private _addCommand(command: TelegramCommand) {
        const botCommand = command.botCommand
        if(botCommand.isShow) {
            this._botCommands.push(botCommand)
        }
    }

    setup(bot: Telegraf): void {
        for (const command of this._container) {
            this._addCommand(command)
            bot.command(command.name, async ctx => {
                const [_, other] = StringUtils.splitByCommands(ctx.text, 1)
                await command.execute(ctx, other)
            })
        }

        bot.telegram.setMyCommands(this._botCommands)
    }
}