import ShortCommandService from "../../../../db/services/short/ShortCommandService"
import type { ConditionalCommandOptions } from "../../../../types/action-options"
import CommandUtils from "../../../../utils/command/CommandUtils"
import Logger from "../../../../utils/logs/Logger"
import ConditionalCommand from "../../base/ConditionalCommand"

export default class ShortCommandConditionalCommand extends ConditionalCommand {
    override async condition(options: ConditionalCommandOptions): Promise<boolean> {
        const {
            ctx,
            id,
            commandStrings: [_, command]
        } = options
        if(!command) return false

        const shortCommand = await ShortCommandService.getByName(id, command)
        ctx.vars.shortCommand = shortCommand

        Logger.debug(
            'ShortCommandConditionalCommand.condition',
            shortCommand
        )

        return Boolean(shortCommand)
    }

    override async execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        const {
            ctx,
            commandStrings: [botName, _, other]
        } = options

        const text = ctx.vars.shortCommand!.text
        ctx.msg.text = `${botName} ${text} ${other ?? ''}`
        ctx.vars.commandStrings = CommandUtils.getCommandStrings(ctx.msg.text)

        Logger.debug(
            'ShortCommandConditionalCommand.execute',
            ctx.msg.text
        )
        return true
    }
}