import ContextUtils from '../../utils/ContextUtils'
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
        const randomMoney = RandomUtils.range(0, 100)
        const money = randomMoney == 1 ? 1000 : randomMoney

        await ctx.editMessageReplyMarkup(undefined)
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