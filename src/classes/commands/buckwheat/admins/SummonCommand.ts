import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { FIRST_INDEX } from '../../../../utils/values/consts'
import { sleep } from '../../../../utils/values/functions'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import UserSettingsService from '../../../db/services/settings/UserSettingsService'
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

        const maxCountOfUsers = (await ChatSettingsService.get<'number'>(chatId, 'summonCount'))!
        const summonCooldown = (await ChatSettingsService.get<'number'>(chatId, 'summonCooldown'))!

        const users = await UserProfileService.getAll(chatId)
        const userEmojies = await UserSettingsService.getSettingForMany(
            users.map(v => v.id),
            'summonEmoji'
        )
        const linksAndEmojies = users.map(({id}) => {
            return {
                link: ContextUtils.getLinkUrl(id),
                emoji: userEmojies.find(v => v.id == id)?.value
            }
        })

        for (let i = 0; i < linksAndEmojies.length; i += maxCountOfUsers) {
            const start = i
            const end = Math.min(
                i + maxCountOfUsers,
                linksAndEmojies.length
            )

            const slicedLinks = linksAndEmojies.slice(start, end)
            if (!slicedLinks.length) {
                break
            }

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/summon/done.pug',
                {
                    changeValues: {
                        text: other,
                        linksAndEmojies: slicedLinks
                    }
                }
            )
            await sleep(summonCooldown)
        }
    }
}