import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import UserProfileService from '../../../db/services/user/UserProfileService'
import AdminUtils from '../../../../utils/AdminUtils'

export default class StaffCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'топ'
        this._description = 'показываю иерархию чата'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        type Player = {id: number, name: string}
        type Rating = {emoji: string, rankName: string, players: Player[]}

        let ratings: Rating[] = []
        const isModerator = await UserRankService.get(ctx.from.id) >= RankUtils.moderatorRank

        for (let rank = RankUtils.maxRank; rank >= 0; rank--) {
            const users = await UserRankService.findByRank(rank)
            if(!users.length) continue

            const players: Player[] = []

            for await (const {id, name} of users) {
                players.push({id: (rank >= RankUtils.adminRank || isModerator) ? id : 0, name})
            }

            ratings.push({
                emoji: RankUtils.getEmojiByRank(rank),
                rankName: RankUtils.getRanksByNumber(rank),
                players
            })
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/staff.pug',
            {
                changeValues: {
                    ratings,
                    members: await UserProfileService.getMembersCount(),
                    maxMembers: await ctx.telegram.getChatMembersCount(ctx.chat?.id ?? 0),
                }
            }
        )
    }
}