import type { ConditionalCommandOptions } from "../../../../types/action-options"
import { updateDatabaseOptions } from "../../../middlewares/middlewares"
import ConditionalCommand from "../../base/ConditionalCommand"

export default class UpdateDatabaseConditionalCommand extends ConditionalCommand {
    override async condition(_options: ConditionalCommandOptions): Promise<boolean> {
        return true
    }

    override async execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        const {
            ctx
        } = options

        await updateDatabaseOptions(ctx)
        return true
    }
}