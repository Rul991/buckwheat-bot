import { EXTRA_RANDOM_NUMBER, EXTRA_RANDOM_PRIZE, MAX_RANDOM_PRIZE, MIN_RANDOM_PRIZE } from '../../utils/values/consts'
import ContextUtils from '../../utils/ContextUtils'
import Logging from '../../utils/Logging'
import MessageUtils from '../../utils/MessageUtils'
import RandomUtils from '../../utils/RandomUtils'
import { CallbackButtonContext } from '../../utils/values/types'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import CallbackButtonAction from './CallbackButtonAction'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'

export default class RandomPrizeButtonAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'randomprize'
    }

    async execute(ctx: CallbackButtonContext, _: string): Promise<void> {
        const randomMoney = RandomUtils.range(MIN_RANDOM_PRIZE, MAX_RANDOM_PRIZE)
        const money = randomMoney == EXTRA_RANDOM_NUMBER ? EXTRA_RANDOM_PRIZE : randomMoney
        
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return

        try {
            await MessageUtils.editMarkup(ctx)
        }
        catch(e) {
            Logging.warn(e)
            return
        }
        await CasinoAddService.money(chatId, ctx.from.id, money)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/actions/random-prize/win.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(
                        chatId, 
                        ctx.from.id, 
                        ctx.from.first_name
                    ),
                    money
                }
            }
        )
    }
}