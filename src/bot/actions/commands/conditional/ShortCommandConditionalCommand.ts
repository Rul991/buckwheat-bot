import ShortCommandService from "../../../../db/services/short/ShortCommandService"
import type { ConditionalCommandOptions } from "../../../../types/action-options"
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

        return Boolean(shortCommand)
    }

    override async execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        const {
            ctx,
            commandStrings: [botName, _, other]
        } = options
        const text = ctx.vars.shortCommand!.text

        ctx.msg.text = `${botName} ${text} ${other ?? ''}`
        return true
    }
}