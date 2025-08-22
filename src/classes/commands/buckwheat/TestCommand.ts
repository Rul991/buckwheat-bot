import { MaybeString, TextContext } from '../../../utils/values/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'
import { DEV_ID } from '../../../utils/values/consts'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
        this._isShow = false
    }

    private async _secretFunction(ctx: TextContext, other: MaybeString) {
        
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.from.id == +(DEV_ID ?? 0)) {
            this._secretFunction(ctx, other)
        }

        await MessageUtils.answerMessageFromResource(ctx, 
            'text/commands/other/test.pug',
            {
                changeValues: {other: other ?? ''}
            }
        )
    }
}