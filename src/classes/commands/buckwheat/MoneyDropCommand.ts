import { MONEY_DROP_TIME } from '../../../utils/consts'
import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class MoneyDropCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'монетка'
        this._description = 'кидаю монетку'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/money-drop/money.pug'
        )

        setTimeout(async () => {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/money-drop/result.pug'
            )
        }, MONEY_DROP_TIME)
    }
}