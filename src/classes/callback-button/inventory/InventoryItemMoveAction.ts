import { object, string, ZodType } from "zod"
import ContextUtils from "../../../utils/ContextUtils"
import { CallbackButtonOptions } from "../../../utils/values/types/action-options"
import CallbackButtonAction from "../CallbackButtonAction"
import { idSchema } from "../../../utils/values/schemas"

type Data = {
    id: number
    itemId: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            itemId: string()
        }))

    constructor() {
        super()
        this._name = 'itemmove'
        this._buttonTitle = 'Инвентарь: Передача'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            chatId,
            id,
            ctx
        } = options

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        await ctx.scene.enter(
            'item-move',
            {
                ...data,
                chatId
            }
        )
    }
}