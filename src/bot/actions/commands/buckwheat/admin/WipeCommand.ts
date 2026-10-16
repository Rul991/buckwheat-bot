import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { chooseWipeKeyboard } from "../../../../keyboards/wipe"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class WipeCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override filename: string = 'wipe'
    override minimumRank: number = RankUtils.max
    override settingId: number = 139
    override name: string = 'вайп'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options
        const user = await ctx.vars.user.get()

        if (ctx.chat.type == 'private') {
            return {
                key: 'wipe/private',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }

        return {
            key: 'wipe/start',
            options: {
                vars: {
                    user
                },
                keyboard: await chooseWipeKeyboard(ctx, { id })
            }
        }
    }
}