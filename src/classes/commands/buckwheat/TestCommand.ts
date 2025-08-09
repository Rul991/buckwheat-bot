import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoRepository from '../../db/repositories/CasinoRepository'
import UserRankService from '../../db/services/user/UserRankService'
import RankUtils from '../../../utils/RankUtils'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        if(await UserRankService.get(ctx.from?.id ?? 0) >= RankUtils.adminRank) {
            const casinos = await CasinoRepository.findMany()
            console.log(casinos)

            for (const casino of casinos) {
                if(casino.money! > 200) {
                    CasinoRepository.updateOne(casino.id, {money: 200})
                }
            }
        }

        await MessageUtils.answerMessageFromResource(ctx, 
            'text/commands/test.html',
            {
                changeValues: {other: other ?? ''}
            }
        )
    }
}