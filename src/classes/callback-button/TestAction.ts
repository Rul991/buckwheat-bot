import { JSONSchemaType } from 'ajv'
import { AsyncOrSync, CallbackButtonContext } from '../../utils/values/types/types'
import CallbackButtonAction from './CallbackButtonAction'
import { MODE } from '../../utils/values/consts'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import MessageUtils from '../../utils/MessageUtils'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import ExperienceUtils from '../../utils/level/ExperienceUtils'
import ExperienceService from '../db/services/level/ExperienceService'
import ContextUtils from '../../utils/ContextUtils'
import StringUtils from '../../utils/StringUtils'
import CasinoGetService from '../db/services/casino/CasinoGetService'

type Data = {
    type: 'level' | 'money'
    value: number
}

type CallbackOptions = {
    ctx: CallbackButtonContext
    data: Data
    chatId: number
    id: number
}

type Callback = ({ }: CallbackOptions) => AsyncOrSync<string>

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            type: {
                type: 'string'
            },
            value: {
                type: 'number'
            }
        },
        required: ['type', 'value']
    }

    private _callbacks: Record<Data['type'], Callback> = {
        level: async ({ id, chatId, data: { value } }: CallbackOptions): Promise<string> => {
            const exp = ExperienceUtils.get(value)
            await ExperienceService.set(chatId, id, exp)
            return `Твой уровень - ${value}`
        },
        money: async ({ id, chatId, data: { value } }: CallbackOptions): Promise<string> => {
            const money = await CasinoGetService.money(chatId, id)
            await CasinoAddService.money(chatId, id, -money + value)
            return `Твой баланс: ${StringUtils.toFormattedNumber(value)}`
        }
    }

    constructor () {
        super()
        this._name = 'test'
    }

    async execute(ctx: CallbackButtonContext, data: Data): Promise<string | void> {
        if (MODE != 'dev') return

        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return

        const {
            type,
        } = data

        const callback = this._callbacks[type]
        if (!callback) return

        const options = {
            chatId,
            id,
            data,
            ctx
        }

        await ContextUtils.showCallbackMessage(
            ctx,
            await callback(options)
        )
    }
}