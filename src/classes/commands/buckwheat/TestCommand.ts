import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoRepository from '../../db/repositories/CasinoRepository'
import { DEV_ID } from '../../../utils/consts'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
    }

    private async _secretFunction(ctx: Context, other: MaybeString) {
        for (const casino of await CasinoRepository.findMany()) {
            console.log(casino.id)
            CasinoRepository.updateOne(casino.id, {loses: 0, money: 0, wins: 0})
        }
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        if(ctx.from?.id == DEV_ID) {
            this._secretFunction(ctx, other)
        }

        await MessageUtils.answerMessageFromResource(ctx, 
            'text/commands/test.html',
            {
                changeValues: {other: other ?? ''}
            }
        )
    }
}