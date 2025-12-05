import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../../../utils/values/types/types'
import CallbackButtonAction from '../../../CallbackButtonAction'
import ContextUtils from '../../../../../utils/ContextUtils'
import CardService from '../../../../db/services/card/CardService'
import FileUtils from '../../../../../utils/FileUtils'

type Data = {
    id: number
    c: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            c: {
                type: 'number'
            },
            id: {
                type: 'number'
            }
        },
        required: ['c', 'id']
    }

    constructor() {
        super()
        this._name = 'csell'
    }

    async execute(ctx: CallbackButtonContext, data: Data): Promise<string | void> {
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