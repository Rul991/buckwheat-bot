import ShopItems from '../../../../utils/ShopItems'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ShopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'магазин'
        this._description = 'открываю магазин'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const index = 0
        const length = ShopItems.len()
        const changeValues = ShopItems.get(index)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/shop/shop.pug',
            {
                changeValues: {...changeValues, index, length},
                inlineKeyboard: ['shop', `${index}_${ctx.from.id}`]
            }
        )
    }
}