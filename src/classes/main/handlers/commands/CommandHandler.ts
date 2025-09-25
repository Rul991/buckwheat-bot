import { Telegraf } from 'telegraf'
import BaseHandler from '../BaseHandler'
import BuckwheatCommand from '../../../commands/base/BuckwheatCommand'
import ConditionalCommand from '../../../commands/base/ConditionalCommand'
import { CommandStrings, TextContext } from '../../../../utils/values/types'
import WrongCommand from '../../../commands/buckwheat/WrongCommand'
import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import CommandUtils from '../../../../utils/CommandUtils'

export default class CommandHandler extends BaseHandler<BuckwheatCommand, ConditionalCommand[], typeof BuckwheatCommand> {
    private static _wrongCommand = new WrongCommand

    private _buckwheatCommands: Record<string, BuckwheatCommand>

    constructor() {
        super([], BuckwheatCommand)
        this._buckwheatCommands = {}
    }

    protected _add(value: BuckwheatCommand): void {
        CommandDescriptionUtils.add(value.commandDescription)
        if(value instanceof ConditionalCommand) {
            super._add(value)
        }
        else {
            for (const name of [value.name, ...value.aliases]) {
                this._buckwheatCommands[name] = value
            }
        }
    }

    protected async _onConditionalCommand(ctx: TextContext, message: CommandStrings) {
        for await (const command of this._container) {
            if(await command.executeIfCondition(ctx, message)) {
                return true
            }
        }

        return false
    }

    protected async _onBuckwheatCommand(ctx: TextContext, [_, command, other]: CommandStrings) {
        const choosedCommand = this._buckwheatCommands[command!.toLowerCase()]

        if(!choosedCommand) {
            CommandHandler._wrongCommand.execute(ctx, other)
        }
        else {
            choosedCommand.execute(ctx, other)
        }
    }

    protected async _onCommand(ctx: TextContext, message: CommandStrings): Promise<void> {
        const [_, command] = message
        
        if(!await this._onConditionalCommand(ctx, message) && command) {
            this._onBuckwheatCommand(ctx, message)
        }
    }

    setup(bot: Telegraf): void {
        bot.on('text', async ctx => {
            if(ctx.message.forward_origin) return
            await CommandUtils.doIfCommand(
                ctx.text,
                async (strings) => {
                    await this._onCommand(ctx, strings)
                }
            )
        })
    }
}