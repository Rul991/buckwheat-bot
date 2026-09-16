import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import { commandsListKeyboard } from "../../../../keyboards/commands"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class CommandsCommand extends BuckwheatCommand {
    override aliases: string[] = [
        'кмд',
        'команда',
        'функции',
    ]
    override minimumRank: number = 0
    override name: string = 'команды'
    override filename: string = 'commands'
    override settingId: number = 12

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
        } = options

        return {
            key: 'commands/command/start',
            options: {
                keyboard: await commandsListKeyboard(ctx, {})
            }
        }
    }
}