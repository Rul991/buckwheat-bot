import { boolean, number, object, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export type Data = {
    id: number,
    end?: boolean
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Дуэль: Сбежать"
    protected _schema: ZodType<Data> = object({
        id: number(),
        end: boolean().optional()
    })

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        
    }
}