import { ZodType } from 'zod'
import CallbackButtonAction from '../../CallbackButtonAction'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import FileUtils from '../../../../utils/FileUtils'
import CardsService from '../../../db/services/card/CardsService'
import StringUtils from '../../../../utils/StringUtils'
import CardService from '../../../db/services/card/CardService'
import CardUtils from '../../../../utils/CardUtils'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { idSchema } from '../../../../utils/values/schemas'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema

    constructor() {
        super()
        this._name = 'cstat'
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const unique = await CardsService.getCards(chatId, id)
        const total = await CardService.getAvailable()
        const inventoryTotal = CardUtils.getTotalCount(unique)
        const user = await ContextUtils.getUser(chatId, id)

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/cards/stats.pug',
                {
                    changeValues: {
                        unique: StringUtils.toFormattedNumber(unique.length),
                        length: StringUtils.toFormattedNumber(total.length),
                        total: StringUtils.toFormattedNumber(inventoryTotal),
                        user,
                    }
                }
            )
        )
    }
}