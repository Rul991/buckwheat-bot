import { boolean, literal, number, object, ZodType } from 'zod'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelUtils from '../../../utils/DuelUtils'
import MessageUtils from '../../../utils/MessageUtils'
import DuelService from '../../db/services/duel/DuelService'
import FileUtils from '../../../utils/FileUtils'
import ContextUtils from '../../../utils/ContextUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export type Data = {
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
    protected _schema: ZodType<Data> = object({
        t: literal(['d', 'u']),
        v: number(),
        end: boolean().optional()
    })

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

    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        const { t: type, v: id, end } = data
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