import { MONEY_DROP_TIME } from '../../../utils/values/consts'
import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/values/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import CasinoGetService from '../../db/services/casino/CasinoGetService'

export default class MoneyDropCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'монетка'
        this._description = 'кидаю монетку'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(await CasinoGetService.getMoney(ctx.from.id) <= 0) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/money-drop/no-money.pug'
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/money-drop/money.pug'
        )

        setTimeout(async () => {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/money-drop/result.pug'
            )
        }, MONEY_DROP_TIME)
    }
}