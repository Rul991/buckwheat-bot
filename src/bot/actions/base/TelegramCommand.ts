import type { BuckwheatCommandOptions } from "../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../types/results"
import RankUtils from "../../../utils/db/RankUtils"
import BuckwheatCommand from "./BuckwheatCommand"

export default abstract class TelegramCommand extends BuckwheatCommand {
    protected abstract _command?: BuckwheatCommand
    override minimumRank: number = RankUtils.min
    override aliases: string[] = []
    override filename: string
    override name: string

    constructor(name: string) {
        super()
        this.name = name
        this.filename = `telegram/${this.name}`
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        return await this._command?.execute(options) ?? { key: 'dev/todo' }
    }

    
}