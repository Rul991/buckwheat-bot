import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ClassCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'класс'
        this._description = 'меняю вам класс'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/class/classes.pug',
            {
                inlineKeyboard: ['class', `${ctx.from.id}`]
            }
        )
    }
}