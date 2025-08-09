import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 
            'text/commands/test.html',
            {
                changeValues: {other: other ?? ''}
            }
        )
    }
}