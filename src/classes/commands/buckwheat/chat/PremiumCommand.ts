import { DEV_PREMIUM_PRICE_PER_MONTH } from './../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import { DEV_ID, MAX_MONTHS_PER_BUY, PREMIUM_PRICE_PER_MONTH } from '../../../../utils/values/consts'
import { MaybeString } from '../../../../utils/values/types/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class PremiumCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'премиум'
        this._description = 'продаю вам премиум для чата'
        this._needData = true
        this._argumentText = 'кол-во месяцев'
        this._aliases = [
            'прем'
        ]
    }

    private _getMonths(other: MaybeString) {
        const rawOther = StringUtils.getNumberFromString(other ?? '1')
        const months = Math.min(
            Math.max(1, Math.floor(rawOther)),
            MAX_MONTHS_PER_BUY
        )

        return months
    }

    private _getPrice(id: number, months: number) {
        return id == DEV_ID ? DEV_PREMIUM_PRICE_PER_MONTH : PREMIUM_PRICE_PER_MONTH * months
    }

    async execute({ ctx, other, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/premium/private.pug'
            )
            return
        }

        const months = this._getMonths(other)
        const price = this._getPrice(id, months)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/premium/premium.pug'
        )

        await MessageUtils.answerInvoice(
            ctx, 
            {
                title: 'Премиум-подписка для чата',
                description: `Даёт чату ${months} месяцев премиум-подписки`,
                payload: `sub_${months}_${chatId}`,
                prices: [{
                    label: `Подписка на ${months} месяцев`,
                    amount: price
                }]
            }
        )
    }
}