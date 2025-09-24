import ClassUtils from '../../../../utils/ClassUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ClassCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'класс'
        this._description = 'меняю вам класс'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const buttons = Object
            .entries(ClassUtils.getVisibleNames())
            .map(([key, value]) => 
                ({text: value, data: `${key}_${ctx.from.id}`}))

        const inlineKeyboard = await InlineKeyboardManager.map(
            'class', 
            buttons
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/class/classes.pug',
            {
                inlineKeyboard
            }
        )
    }
}