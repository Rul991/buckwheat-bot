import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ShopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'магазин'
        this._description = 'открываю магазин'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/shop/start.pug',
            {
                inlineKeyboard: ['start_shop', `${ctx.from.id}`]
            }
        )
    }
}