import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { businessMenuKeyboard } from "../../../../keyboards/business"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class BusinessCommand extends BuckwheatCommand {
    override aliases: string[] = ['бизнесы']
    override filename: string = 'business'
    override minimumRank: number = RankUtils.min
    override settingId: number = 172
    override name: string = 'бизнес'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        return {
            key: 'business/message/menu/menu',
            options: {
                keyboard: await businessMenuKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}