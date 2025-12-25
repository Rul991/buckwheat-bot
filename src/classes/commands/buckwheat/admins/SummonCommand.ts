import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { FIRST_INDEX } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import UserProfileService from '../../../db/services/user/UserProfileService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'призыв'
        this._description = 'призывает людей из чата'
        this._minimumRank = RankUtils.admin
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            chatId,
            id,
            other
        } = options

        const rank = await UserRankService.get(chatId, id)
        if (rank < this._minimumRank) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/summon/rank-issue.pug',
                {
                    changeValues: {
                        rankName: RankUtils.getRankByNumber(this._minimumRank)
                    }
                }
            )
            return
        }

        const maxCountOfUsers = (await ChatSettingsService.get<'number'>(chatId, 'summonMaxCount'))!

        const users = await UserProfileService.getAll(chatId)
        const links = users
            .slice(FIRST_INDEX, maxCountOfUsers)
            .map(({ id }) => ContextUtils.getLinkUrl(id))

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/summon/done.pug',
            {
                changeValues: {
                    text: other,
                    links
                }
            }
        )
    }
}