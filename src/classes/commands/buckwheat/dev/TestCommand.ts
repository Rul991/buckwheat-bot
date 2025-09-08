import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import { DEV_ID } from '../../../../utils/values/consts'
import CallbackButtonManager from '../../../main/CallbackButtonManager'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
        this._isShow = false
    }

    private async _secretFunction(ctx: TextContext, _: MaybeString) {
        await CasinoAddService.addMoney(ctx.chat.id, ctx.from.id, Number.MAX_SAFE_INTEGER)
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(DEV_ID && ctx.from.id == DEV_ID) {
            this._secretFunction(ctx, other)
        }

        let test: {text: string, data: string}[] = []

        for (let i = 1; i < 1000; i++) {
            test.push({text: i.toString(), data: i.toString()})
        }

        await MessageUtils.answerMessageFromResource(ctx, 
            'text/commands/other/test.pug',
            {
                changeValues: {other: other ?? ''},
                inlineKeyboard: await CallbackButtonManager.map('test', test)
            }
        )
    }
}