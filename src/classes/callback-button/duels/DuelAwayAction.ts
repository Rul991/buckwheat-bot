import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelUtils from '../../../utils/DuelUtils'
import MessageUtils from '../../../utils/MessageUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import DuelService from '../../db/services/duel/DuelService'
import FileUtils from '../../../utils/FileUtils'
import ContextUtils from '../../../utils/ContextUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'

type Data = {
    t: 'd' | 'u',
    v: number,
    end?: boolean
}

type Args = {
    ctx: CallbackButtonContext,
    duelId: number
    chatId: number
    userId: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            t: { type: 'string' },
            v: { type: 'number' },
            end: {
                type: 'boolean',
                nullable: true
            }
        },
        required: ['t', 'v']
    }

    constructor () {
        super()
        this._name = 'duelaway'
    }

    private async _doIfEndFalse({ ctx, chatId, duelId, userId: id }: Args) {
        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/duel/fight/away.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUser(chatId, id)
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'duels/away',
                        {
                            duel: JSON.stringify({ id: duelId }),
                            user: JSON.stringify({ v: duelId, t: 'd' })
                        }
                    )
                }
            }
        )
    }

    private async _doIfEndTrue({ ctx, duelId, chatId, userId: id }: Args) {
        const duel = await DuelService.get(duelId)
        if (!duel) return
        const { firstDuelist, secondDuelist } = duel

        await DuelUtils.end(ctx, {
            chatId,
            duelId,
            winnerId: firstDuelist == id ? secondDuelist : firstDuelist
        })
    }

    async execute(ctx: CallbackButtonContext, { t: type, v: id, end }: Data): Promise<string | void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if (!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        const isUserId = type == 'u'
        const duel: { id: number } | null = isUserId ?
            await DuelService.getByUserId(chatId, id) :
            { id }
        if (!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')
        const duelId = duel.id

        if (isUserId && await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return
        if (!isUserId && await DuelUtils.showAlertIfCantUse(ctx, id)) return

        const options = {
            ctx,
            duelId,
            chatId,
            userId: ctx.from.id
        }

        if (end) {
            await this._doIfEndTrue(options)
        }
        else {
            await this._doIfEndFalse(options)
        }
    }
}