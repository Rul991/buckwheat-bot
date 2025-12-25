import { Telegraf } from 'telegraf'
import BaseHandler from '../BaseHandler'
import TelegramCommand from '../../../commands/base/TelegramCommand'
import { BotCommand } from 'telegraf/types'
import StringUtils from '../../../../utils/StringUtils'
import { MyTelegraf } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'

export default class TelegramCommandHandler extends BaseHandler<TelegramCommand, TelegramCommand[], typeof TelegramCommand> {
    private _botCommands: BotCommand[]

    constructor () {
        super([], TelegramCommand)
        this._botCommands = []
    }

    private _addCommand(command: TelegramCommand) {
        const botCommand = command.botCommand
        if (botCommand.isShow) {
            this._botCommands.push(botCommand)
        }
    }

    setup(bot: MyTelegraf): void {
        for (const command of this._container) {
            this._addCommand(command)
            bot.command(command.name, async ctx => {
                const id = ctx.from.id
                const chatId = await LinkedChatService.getCurrent(ctx, id)
                if (!chatId) return

                const replyFrom = ctx.message.reply_to_message?.from
                const replyOrUserFrom = replyFrom ?? ctx.from

                const [_, other] = StringUtils.splitByCommands(ctx.text, 1)
                await command.execute({ ctx, other, chatId, id, replyFrom, replyOrUserFrom })
            })
        }

        bot.telegram.setMyCommands(this._botCommands)
    }
}