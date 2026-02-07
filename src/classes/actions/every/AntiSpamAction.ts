import EveryMessageAction from './EveryMessageAction'
import AntiSpamService from '../../db/services/antispam/AntiSpamService'
import AdminUtils from '../../../utils/AdminUtils'
import { DEFAULT_MUTE_TIME, MILLISECONDS_IN_SECOND } from '../../../utils/values/consts'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import TimeUtils from '../../../utils/TimeUtils'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'

export default class AntiSpamAction extends EveryMessageAction {
    async execute({ ctx, chatId, id }: EveryMessageOptions): Promise<void | true> {
        const status = await ContextUtils.getStatus(ctx)
        if (status == 'creator' || status == 'administrator') return

        await AntiSpamService.add(id, 'lastMessagesCount', 1)
        const isSpamming = await AntiSpamService.isSpamming(chatId, id)

        if (isSpamming) {
            const muteTime = (await ChatSettingsService.get<'number'>(
                chatId,
                'antiSpamMute'
            ) ?? (DEFAULT_MUTE_TIME / MILLISECONDS_IN_SECOND)) * MILLISECONDS_IN_SECOND

            if (status != 'restricted') {
                await AdminUtils.mute(ctx, id, muteTime)
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/spam.pug',
                    {
                        changeValues: {
                            ...await ContextUtils.getUser(chatId, id),
                            time: TimeUtils.formatMillisecondsToTime(muteTime)
                        }
                    }
                )
            }
            return true
        }
    }
}