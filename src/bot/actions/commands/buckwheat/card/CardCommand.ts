import UserCardService from "../../../../../db/services/card/UserCardService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startCardKeyboard } from "../../../../keyboards/cards"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class CardCommand extends BuckwheatCommand {
    override aliases: string[] = ['карточки', 'карта', 'карточка']
    override filename: string = 'card'
    override minimumRank: number = RankUtils.min
    override settingId: number = 159
    override name: string = 'карты'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx,
            id,
        } = options

        const stats = await UserCardService.getStats(
            chatId,
            id
        )
        const user = await ctx.vars.user.get()

        return {
            key: 'card/message/stats',
            options: {
                vars: {
                    stats,
                    user
                },
                keyboard: await startCardKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}