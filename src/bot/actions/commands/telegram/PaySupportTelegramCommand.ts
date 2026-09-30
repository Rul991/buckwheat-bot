import type { BuckwheatCommandOptions } from "../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../types/results"
import type BuckwheatCommand from "../../base/BuckwheatCommand"
import TelegramCommand from "../../base/TelegramCommand"

export default class PaySupportTelegramCommand extends TelegramCommand {
    protected override _command?: BuckwheatCommand | undefined
    override settingId: number = 98
    
    constructor() {
        super('paysupport')
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx
        } = options

        return {
            key: 'telegram/paysupport',
            options: {
                vars: {
                    chat: ctx.chat
                }
            }
        }
    }
}