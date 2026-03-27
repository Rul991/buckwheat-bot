import { EXTRA_RANDOM_NUMBER, EXTRA_RANDOM_PRIZE, MAX_RANDOM_PRIZE, MILLISECONDS_IN_SECOND, MIN_RANDOM_PRIZE, SECONDS_IN_MINUTE } from '../../utils/values/consts'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import RandomUtils from '../../utils/RandomUtils'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import CallbackButtonAction from './CallbackButtonAction'
import { string, ZodType } from 'zod'
import CasinoGetService from '../db/services/casino/CasinoGetService'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'
import AdminUtils from '../../utils/AdminUtils'

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
        await AdminUtils.mute(
            ctx,
            id,
            MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE
        )
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/actions/random-prize/win.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(
                        chatId,
                        id,
                    )
                }
            }
        )
    }
}