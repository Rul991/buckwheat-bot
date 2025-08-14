import { EXTRA_RANDOM_NUMBER, EXTRA_RANDOM_PRIZE, MAX_RANDOM_PRIZE, MIN_RANDOM_PRIZE } from '../../utils/consts'
import ContextUtils from '../../utils/ContextUtils'
import Logging from '../../utils/Logging'
import MessageUtils from '../../utils/MessageUtils'
import RandomUtils from '../../utils/RandomUtils'
import { CallbackButtonContext } from '../../utils/types'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import CallbackButtonAction from './CallbackButtonAction'

export default class RandomPrizeButtonAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'randomprize'
    }

    async execute(ctx: CallbackButtonContext, _: string): Promise<void> {
        const randomMoney = RandomUtils.range(MIN_RANDOM_PRIZE, MAX_RANDOM_PRIZE)
        const money = randomMoney == EXTRA_RANDOM_NUMBER ? EXTRA_RANDOM_PRIZE : randomMoney

        try {
            await MessageUtils.editMarkup(ctx)
        }
        catch(e) {
            Logging.warn(e)
            return
        }
        await CasinoAddService.addMoney(ctx.from.id, money)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/actions/random-prize/win.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(
                        ctx.from.id, 
                        ctx.from.first_name
                    ),
                    money
                }
            }
        )
    }
}