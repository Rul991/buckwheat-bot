import BaseHandler from '../BaseHandler'
import TelegramCommand from '../../../commands/base/TelegramCommand'
import { BotCommand } from 'telegraf/types'
import { MyTelegraf } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ArrayContainer from '../../containers/ArrayContainer'

export default class TelegramCommandHandler extends BaseHandler<TelegramCommand, ArrayContainer<TelegramCommand>> {
    private _botCommands: BotCommand[]

    constructor () {
        super(new ArrayContainer())
        this._botCommands = []
    }

    private _addCommand(command: TelegramCommand) {
        const botCommand = command.botCommand
        if (botCommand.isShow) {
            this._botCommands.push(botCommand)
        }
    }

    async setup(bot: MyTelegraf): Promise<void> {
        await this._container.forEach(command => {
            this._addCommand(command)
            bot.command(command.name, async ctx => {
                const id = ctx.from.id
                const chatId = await LinkedChatService.getCurrent(ctx, id)
                if (!chatId) return

                const replyFrom = ctx.message.reply_to_message?.from
                const replyOrUserFrom = replyFrom ?? ctx.from

                const other = ctx.args.join(' ')
                await command.execute({ ctx, other, chatId, id, replyFrom, replyOrUserFrom })
            })
        })

        bot.telegram.setMyCommands(this._botCommands)
    }
}