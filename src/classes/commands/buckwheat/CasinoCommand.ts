import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import ContextUtils from '../../../utils/ContextUtils'
import CasinoAccountService from '../../db/services/casino/CasinoAccountService'

export default class CasinoCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'казино'
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        const [casino] = await CasinoAccountService.updateDailyMoney(ctx.from?.id ?? 0)
        if(!casino) return

        await ContextUtils.answerMessageFromResource(
            ctx, 
            'text/commands/casino.html', 
            {
                money: casino?.money?.toString() ?? '',
                wins: casino?.wins?.toString() ?? '',
                loses: casino?.loses?.toString() ?? '',
            }
        )
    }
}