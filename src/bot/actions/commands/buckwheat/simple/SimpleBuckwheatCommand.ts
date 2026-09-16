import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

type SimpleBuckwheatOptions =
    & Pick<SimpleBuckwheatCommand, 'aliases' | 'name' | 'key'>

export default class SimpleBuckwheatCommand extends BuckwheatCommand {
    static from(...commands: SimpleBuckwheatOptions[]): SimpleBuckwheatCommand[] {
        return commands.map(options => {
            return new this(options)
        })
    }

    override aliases: string[]
    override minimumRank: number
    override name: string
    key: string
    override settingId: number = 16
    override filename: string = 'simple'

    constructor({
        name,
        aliases,
        key
    }: SimpleBuckwheatOptions) {
        super()
        this.aliases = aliases
        this.name = name
        this.key = key

        this.isShow = false
        this.minimumRank = RankUtils.min
    }

    override async execute(_: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        return {
            key: this.key
        }
    }
}