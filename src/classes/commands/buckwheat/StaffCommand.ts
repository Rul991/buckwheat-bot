import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import ContextUtils from '../../../utils/ContextUtils'
import UserRankService from '../../db/services/user/UserRankService'
import RankUtils from '../../../utils/RankUtils'

export default class StaffCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'топ'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        let rating = ''

        for (let rank = RankUtils.maxRank; rank >= 0; rank--) {
            const users = await UserRankService.findByRank(rank)
            if(!users.length) continue

            rating += `\n<b>${RankUtils.getEmojiByRank(rank)} ${RankUtils.getRanksByNumber(rank)}:</b>\n`

            for await (const {id, name} of users) {
                rating += `📍 ${ContextUtils.getLink(name, id ?? 0)}\n`
            }
        }

        await ContextUtils.answerMessageFromResource(
            ctx,
            'text/commands/staff.html',
            {
                rating
            },
            false
        )
    }
}