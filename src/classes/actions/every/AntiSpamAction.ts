import { Context } from 'telegraf'
import EveryMessageAction from './EveryMessageAction'
import AntiSpamService from '../../db/services/antispam/AntiSpamService'
import AdminUtils from '../../../utils/AdminUtils'
import { DEFAULT_USER_NAME, MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from '../../../utils/consts'
import MessageUtils from '../../../utils/MessageUtils'
import UserNameService from '../../db/services/user/UserNameService'
import ContextUtils from '../../../utils/ContextUtils'

export default class AntiSpamAction extends EveryMessageAction {
    async execute(ctx: Context): Promise<void | true> {
        const id = ctx.from?.id ?? 0

        await AntiSpamService.add(id, 'lastMessagesCount', 1)
        const isSpamming = await AntiSpamService.isSpamming(id)

        if(isSpamming) {
            await AdminUtils.mute(ctx, id, MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * 2)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/spam.pug',
                {
                    changeValues: {
                        name: await UserNameService.get(id) ?? DEFAULT_USER_NAME,
                        link: ContextUtils.getLinkUrl(id)
                    }
                }
            )
            return true
        }
    }
}