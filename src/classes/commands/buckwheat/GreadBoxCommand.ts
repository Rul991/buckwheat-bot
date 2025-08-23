import MessageUtils from '../../../utils/MessageUtils'
import StringUtils from '../../../utils/StringUtils'
import { TextContext, MaybeString } from '../../../utils/values/types'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import InventoryItemService from '../../db/services/items/InventoryItemService'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class GreadBoxCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'шкатулка'
        this._description = 'шкатулка жадности дает деньги ее владельцу'
        this._argumentText = 'деньги'
        this._needData = true
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const money = other && !isNaN(+other) ? Math.ceil(+other) : -1
        const [hasBox] = await InventoryItemService.use(ctx.from.id, 'greedBox')

        if(!hasBox) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/greedBox/cant.pug'
            )
            return
        }

        if(money < 0) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/greedBox/no-other.pug'
            )
            return
        }

        await CasinoAddService.addMoney(ctx.from.id, money)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/greedBox/done.pug',
            {
                changeValues: {
                    money: StringUtils.toFormattedNumber(money)
                }
            }
        )
    }
}