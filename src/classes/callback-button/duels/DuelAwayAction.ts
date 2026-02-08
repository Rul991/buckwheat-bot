import { number, object, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import DuelService from '../../db/services/duel/DuelService'
import FileUtils from '../../../utils/FileUtils'
import DuelUtils from '../../../utils/duel/DuelUtils'

export type Data = {
    id: number,
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Дуэль: Сбежать"
    protected _schema: ZodType<Data> = object({
        id: number(),
    })

    constructor() {
        super()
        this._name = 'duelaway'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId
        } = options

        const {
            id,
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const duel = await DuelService.getByUserId(chatId, id)
        if (!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')

        await DuelUtils.end({
            chatId,
            ctx,
            duel,
            winner: DuelUtils.getEnemy(duel, id)
        })
    }
}