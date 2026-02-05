import { RANDOM_PRIZE_CHANCE } from '../../../utils/values/consts'
import MessageUtils from '../../../utils/MessageUtils'
import RandomUtils from '../../../utils/RandomUtils'
import { MessageContext } from '../../../utils/values/types/contexts'
import EveryMessageAction from './EveryMessageAction'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'

export default class RandomPrizeMessageAction extends EveryMessageAction {
    async execute({ ctx, chatId, id }: EveryMessageOptions): Promise<void | true> {
        const canSend = await ChatSettingsService.get<'boolean'>(chatId, 'spawnBox')
        if(!canSend) return

        const money = await CasinoGetService.money(chatId, id)
        const needSend = money > 0 && RandomUtils.chance(RANDOM_PRIZE_CHANCE)

        if(needSend) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/actions/random-prize/spawn.pug',
                {
                    inlineKeyboard: await LegacyInlineKeyboardManager.get('random_prize')
                }
            )
        }
    }
}