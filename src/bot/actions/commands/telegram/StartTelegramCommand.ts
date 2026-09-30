import type { BuckwheatCommandOptions } from "../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../types/results"
import type BuckwheatCommand from "../../base/BuckwheatCommand"
import TelegramCommand from "../../base/TelegramCommand"

export default class StartTelegramCommand extends TelegramCommand {
    protected override _command?: BuckwheatCommand | undefined
    override settingId: number = 95
    
    constructor() {
        super('start')
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx
        } = options

        return {
            key: 'telegram/start',
            options: {
                vars: {
                    chat: ctx.chat
                }
            }
        }
    }
}