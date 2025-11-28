import { EXTRA_RANDOM_NUMBER, EXTRA_RANDOM_PRIZE, MAX_RANDOM_PRIZE, MIN_RANDOM_PRIZE } from '../../utils/values/consts'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import RandomUtils from '../../utils/RandomUtils'
import { CallbackButtonContext } from '../../utils/values/types/types'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import CallbackButtonAction from './CallbackButtonAction'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import { JSONSchemaType } from 'ajv'
import CasinoGetService from '../db/services/casino/CasinoGetService'
import FileUtils from '../../utils/FileUtils'

export default class RandomPrizeButtonAction extends CallbackButtonAction<string> {
    protected _schema: JSONSchemaType<string> = {type: 'string'}

    constructor() {
        super()
        this._name = 'randomprize'
    }

    protected _getData(raw: string): string {
        return raw
    }

    async execute(ctx: CallbackButtonContext, _: string): Promise<string | void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        const botId = ctx.botInfo.id
        const id = ctx.from.id
        const name = ctx.from.first_name

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
                        name
                    ),
                    money
                }
            }
        )
    }
}