import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SayCommand extends BuckwheatCommand {
    override aliases: string[] = ['скажи']
    override filename: string = 'say'
    override minimumRank: number = RankUtils.min
    override settingId: number = 93
    override name: string = 'сказать'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            other
        } = options
        const user = await ctx.vars.user.get()

        if(!other) {
            return {
                key: 'say/no-other',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }

        const message = ctx.msg
        const text = MessageEntityUtils.messageToHtml(
            message
        )

        return {
            key: 'say/say',
            options: {
                vars: {
                    text,
                }
            }
        }
    }
}