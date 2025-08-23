import EveryMessageAction from './EveryMessageAction'
import AntiSpamService from '../../db/services/antispam/AntiSpamService'
import AdminUtils from '../../../utils/AdminUtils'
import { MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from '../../../utils/values/consts'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import { MessageContext } from '../../../utils/values/types'

export default class AntiSpamAction extends EveryMessageAction {
    async execute(ctx: MessageContext): Promise<void | true> {
        const id = ctx.from.id

        await AntiSpamService.add(id, 'lastMessagesCount', 1)
        const isSpamming = await AntiSpamService.isSpamming(id)

        if(isSpamming) {
            await AdminUtils.mute(ctx, id, MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * 2)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/spam.pug',
                {
                    changeValues: await ContextUtils.getUser(id)
                }
            )
            return true
        }
    }
}