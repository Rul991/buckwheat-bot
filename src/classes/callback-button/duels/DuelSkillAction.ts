import { ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { duelSchema } from '../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Data = {
    duel: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = duelSchema
    protected _buttonTitle?: string | undefined = "Дуэль: Навыки"

    constructor () {
        super()
        this._name = 'duelskills'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        
    }
}