import { RANDOM_PRIZE_CHANCE } from '../../../utils/consts'
import MessageUtils from '../../../utils/MessageUtils'
import RandomUtils from '../../../utils/RandomUtils'
import { MessageContext } from '../../../utils/types'
import EveryMessageAction from './EveryMessageAction'

export default class RandomPrizeMessageAction extends EveryMessageAction {
    async execute(ctx: MessageContext): Promise<void | true> {
        const needSend = RandomUtils.chance(RANDOM_PRIZE_CHANCE)

        if(needSend) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/actions/random-prize/spawn.pug',
                {
                    inlineKeyboard: ['random_prize', '@']
                }
            )
            return true
        }
    }
}