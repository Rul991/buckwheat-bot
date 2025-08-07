import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'

export default class CheatCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'читы'
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        const id = ctx.from?.id ?? 0
        const rank = await UserRankService.get(id)

        if(rank >= 5) {
            await CasinoAddService.addMoney(id, 999999)
        }

        await ContextUtils.answerMessageFromResource(
            ctx,
            'text/commands/wrongCommand.html'
        )
    }
}