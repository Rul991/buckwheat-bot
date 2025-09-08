import MessageUtils from '../../../../utils/MessageUtils'
import { MAX_SHOP_COUNT } from '../../../../utils/values/consts'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import CallbackButtonManager from '../../../main/CallbackButtonManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ShopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'магазин'
        this._description = 'открываю магазин'
        this._needData = true
        this._argumentText = 'количество'
    }

    private _getCount(other: MaybeString): number {
        if(other && !isNaN(+other) && +other > 0)
            return Math.min(MAX_SHOP_COUNT, +other)
        else 
            return 1
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const count = this._getCount(other)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/shop/start.pug',
            {
                inlineKeyboard: await CallbackButtonManager.get(
                    'start_shop', 
                    `${ctx.from.id}_${count}`
                )
            }
        )
    }
}