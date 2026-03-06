import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import RateLimitUtils from '../../../../utils/ratelimit/RateLimitUtils'
import { sleep } from '../../../../utils/values/functions'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import UserSettingsService from '../../../db/services/settings/UserSettingsService'
import UserProfileService from '../../../db/services/user/UserProfileService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'summon'

    constructor () {
        super()
        this._name = 'призыв'
        this._description = 'призываю людей из чата'
        this._minimumRank = RankUtils.admin
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            chatId,
            id,
            other
        } = options

        const isPrivate = ctx.chat.type == 'private'
        if (isPrivate) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/summon/private.pug'
            )
            return
        }

        const messagesPerTime = 3
        const sleepTime = 5000

        const maxCountOfUsers = (await ChatSettingsService.get<'number'>(chatId, 'summonCount'))!
        const users = await UserProfileService.getAll(chatId)
        const userEmojies = await UserSettingsService.getSettingForMany(
            users.map(v => v.id),
            'summonEmoji'
        )
        const linksAndEmojies = users.map(({ id }) => {
            return {
                link: ContextUtils.getLinkUrl(id),
                emoji: userEmojies.find(v => v.id == id)?.value
            }
        })

        const length = linksAndEmojies.length
        for (let i = 0; i < length; i += maxCountOfUsers) {
            if (i > 0 && Math.floor(i / maxCountOfUsers) % messagesPerTime == 0) {
                await sleep(sleepTime)
            }

            const start = i
            const end = i + maxCountOfUsers

            const slicedLinks = linksAndEmojies.slice(start, end)
            if (!slicedLinks.length) {
                break
            }

            await new Promise<void>((resolve) => {
                setImmediate(async () => {
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
                    RateLimitUtils.isLimit(
                        chatId,
                        id
                    )
                    resolve()
                })
            })
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/summon/end.pug'
        )
    }
}