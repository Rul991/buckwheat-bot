import { ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelService from '../../db/services/duel/DuelService'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
    protected _buttonTitle?: string | undefined = "Дуэль: Меню"

    constructor () {
        super()
        this._name = 'duelfight'
    }

    async execute({ data: { id } }: CallbackButtonOptions<Data>): Promise<string | void> {
        const duel = await DuelService.get(id)
        if (!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')
    }
}