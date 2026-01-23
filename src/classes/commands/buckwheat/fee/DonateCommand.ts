import { STAR_TO_COIN } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import StringUtils from '../../../../utils/StringUtils'
import MathUtils from '../../../../utils/MathUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class DonateCommand extends BuckwheatCommand {
    protected _settingId: string = 'donate'
    protected _canBeChanged: boolean = false

    private _starPrice = {
        min: 1,
        max: 100000
    }

    constructor() {
        super()
        this._name = 'донат'
        this._description = 'продаю монеты за звезды'
        this._needData = true
        this._argumentText = 'кол-во звезд'
    }

    async execute({ ctx, other, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const rawRubles = MathUtils.clamp(
            StringUtils.getNumberFromString(other ?? '1'),
            this._starPrice.min,
            this._starPrice.max,
        )
        
        if(isNaN(rawRubles)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/wrong-other.pug'
            )
            return
        }

        const stars = Math.ceil(+rawRubles)
        const coins = Math.ceil(stars * STAR_TO_COIN)
        const formattedCoins = StringUtils.toFormattedNumber(coins)

        await MessageUtils.answerInvoice(
            ctx,
            {
                title: `Покупка монет`,
                description: `Покупка ${formattedCoins} 💰`,
                payload: `donate_${chatId}`,
                prices: [{
                    label: `Купить ${formattedCoins} 💰`,
                    amount: stars
                }]
            }
        )
    }
}