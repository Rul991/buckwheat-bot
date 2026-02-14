import { EXTRA_RANDOM_NUMBER, EXTRA_RANDOM_PRIZE, MAX_RANDOM_PRIZE, MIN_RANDOM_PRIZE } from '../../utils/values/consts'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import RandomUtils from '../../utils/RandomUtils'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import CallbackButtonAction from './CallbackButtonAction'
import { string, ZodType } from 'zod'
import CasinoGetService from '../db/services/casino/CasinoGetService'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'

type Data = string

export default class RandomPrizeButtonAction extends CallbackButtonAction<string> {
    protected _buttonTitle: string = 'Коробка'
    protected _schema: ZodType<Data> = string()

    constructor () {
        super()
        this._name = 'randomprize'
    }

    protected _getData(raw: string): Data {
        return raw
    }

    async execute({ ctx, chatId, id }: CallbackButtonOptions<Data>): Promise<string | void> {
        const botId = ctx.botInfo.id

        const randomMoney = RandomUtils.range(MIN_RANDOM_PRIZE, MAX_RANDOM_PRIZE)
        const money = Math.min(
            randomMoney == EXTRA_RANDOM_NUMBER ? EXTRA_RANDOM_PRIZE : randomMoney,
            await CasinoGetService.money(chatId, botId)
        )

        await MessageUtils.editMarkup(ctx)
        await CasinoAddService.money(chatId, id, money)
        await CasinoAddService.money(chatId, botId, -money)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/actions/random-prize/win.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(
                        chatId,
                        id,
                    ),
                    money
                }
            }
        )
    }
}