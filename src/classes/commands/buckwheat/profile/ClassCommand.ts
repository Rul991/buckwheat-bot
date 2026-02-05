import ClassUtils from '../../../../utils/ClassUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { MODE } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { ClassTypes, MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../../db/services/user/UserClassService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ClassCommand extends BuckwheatCommand {
    protected _settingId: string = 'class'

    constructor() {
        super()
        this._name = 'класс'
        this._description = 'показываю или даю вам класс'
    }

    async execute({ ctx, id: userId, chatId }: BuckwheatCommandOptions): Promise<void> {
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
                ({
                    text: `${ClassUtils.getEmoji(key as ClassTypes)} ${value}`, 
                    data: JSON.stringify(
                        {
                            classType: key, 
                            userId}
                        )}
                    )
                )

        const inlineKeyboard = await LegacyInlineKeyboardManager.map(
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