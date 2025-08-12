import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoRepository from '../../db/repositories/CasinoRepository'
import { DEV_ID } from '../../../utils/consts'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
        this._isShow = false
    }

    private async _secretFunction(ctx: TextContext, other: MaybeString) {
        const casinos = await CasinoRepository.findMany()
        const sortedCasinos = casinos.sort((a, b) => {
            return b.money! - a.money!
        })
        for (const casino of sortedCasinos) {
            console.log(casino.id, casino.money)
        }
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.from.id == +(DEV_ID ?? 0)) {
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