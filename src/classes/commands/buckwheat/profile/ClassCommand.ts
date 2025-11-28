import ClassUtils from '../../../../utils/ClassUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { MODE } from '../../../../utils/values/consts'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../../db/services/user/UserClassService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ClassCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'класс'
        this._description = 'показываю или даю вам класс'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const userId = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return

        const className = await UserClassService.get(chatId, userId)
        if(MODE == 'prod' && await UserClassService.isPlayer(chatId, userId)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/class/not-unknown.pug',
                {
                    changeValues: {
                        className: ClassUtils.getName(className),
                        emoji: ClassUtils.getEmoji(className)
                    }
                }
            )
            return
        }

        const buttons = Object
            .entries(ClassUtils.getVisibleNames())
            .map(([key, value]) => 
                ({text: value, data: JSON.stringify({classType: key, userId})}))

        const inlineKeyboard = await InlineKeyboardManager.map(
            'class', 
            {
                values: {
                    class: buttons
                }
            }
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