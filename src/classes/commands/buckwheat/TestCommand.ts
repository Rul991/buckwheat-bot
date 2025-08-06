import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import ContextUtils from '../../../utils/ContextUtils'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        await ContextUtils.answerMessageFromResource(ctx, 
            'text/commands/test.html',
            {other: other ?? ''}
        )
    }
}