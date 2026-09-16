import type { ConditionalCommandOptions } from "../../../../types/action-options"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ConditionalCommand from "../../base/ConditionalCommand"

export default class CapsConditionalCommand extends ConditionalCommand {
    override async condition(options: ConditionalCommandOptions): Promise<boolean> {
        const {
            commandStrings: [botName]
        } = options

        return botName == botName.toUpperCase()
    }

    override async execute(options: ConditionalCommandOptions): Promise<void> {
        const {
            ctx
        } = options

        await MessageUtils.reply(
            ctx,
            'conditional/caps'
        )
    }
}