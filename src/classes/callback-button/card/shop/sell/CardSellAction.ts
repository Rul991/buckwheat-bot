import { number, object, ZodType } from 'zod'
import CallbackButtonAction from '../../../CallbackButtonAction'
import ContextUtils from '../../../../../utils/ContextUtils'
import CardService from '../../../../db/services/card/CardService'
import FileUtils from '../../../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../../../utils/values/types/action-options'

type Data = {
    id: number
    c: number
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Продажа карты"
    protected _schema: ZodType<Data> = object({
        id: number(),
        c: number()
    })

    constructor() {
        super()
        this._name = 'csell'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            c: cardId,
            id
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const card = await CardService.get(cardId)
        if(!card) return await FileUtils.readPugFromResource(
            'text/commands/cards/no-card.pug',
            {
                changeValues: {
                    id: cardId
                }
            }
        )

        await ctx.scene.enter(
            'card-price-sell',
            {
                card
            }
        )
    }
}