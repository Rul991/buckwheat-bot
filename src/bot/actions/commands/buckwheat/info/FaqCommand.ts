import { IS_DEV } from "../../../../../consts/env"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import FaqUtils from "../../../../../utils/faq/FaqUtils"
import { startFaqKeyboard } from "../../../../keyboards/faq"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class FaqCommand extends BuckwheatCommand {
    override aliases: string[] = ['чаво', 'помоги', 'помощь']
    override minimumRank: number = RankUtils.min
    override name: string = 'как'
    override filename: string = 'faq'
    override settingId: number = 11

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        if(IS_DEV) {
            await FaqUtils.setup()
        }

        return {
            key: 'faq/message/start',
            options: {
                keyboard: await startFaqKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}