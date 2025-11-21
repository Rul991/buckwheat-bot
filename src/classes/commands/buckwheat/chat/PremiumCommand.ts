import MessageUtils from '../../../../utils/MessageUtils'
import { MAX_MONTHS_PER_BUY, PREMIUM_PRICE_PER_MONTH } from '../../../../utils/values/consts'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class PremiumCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'премиум'
        this._description = 'продаю вам премиум для чата'
        this._needData = true
        this._argumentText = 'кол-во месяцев'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/premium/private.pug'
            )
            return
        }

        const chatId = ctx.chat.id

        const rawOther = +(other ?? '1')
        const months = Math.min(
            Math.max(1, isNaN(rawOther) ? 1 : rawOther),
            MAX_MONTHS_PER_BUY
        )

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
                    amount: PREMIUM_PRICE_PER_MONTH * months
                }]
            }
        )
    }
}