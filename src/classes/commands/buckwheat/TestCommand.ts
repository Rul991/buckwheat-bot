import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoRepository from '../../db/repositories/CasinoRepository'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        for (const casino of await CasinoRepository.findMany()) {
            console.log(casino.id)
            CasinoRepository.updateOne(casino.id, {loses: 0, money: 0, wins: 0})
        }

        await MessageUtils.answerMessageFromResource(ctx, 
            'text/commands/test.html',
            {
                changeValues: {other: other ?? ''}
            }
        )
    }
}