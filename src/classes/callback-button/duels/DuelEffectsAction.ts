import { ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { duelSchema } from '../../../utils/values/schemas'

type Data = {
    duel: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = duelSchema
    protected _buttonTitle?: string | undefined = "Дуэль: Эффекты"

    constructor () {
        super()
        this._name = 'dueleffects'
    }

    async execute({ ctx, data: { duel: duelId } }: CallbackButtonOptions<Data>): Promise<string | void> {
        
    }
}