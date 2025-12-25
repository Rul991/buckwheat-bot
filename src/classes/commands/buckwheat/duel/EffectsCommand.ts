import { InlineKeyboardButton } from 'telegraf/types'
import ClassUtils from '../../../../utils/ClassUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString, ClassTypes, CallbackButtonValue } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import SkillUtils from '../../../../utils/SkillUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'эффекты'
        this._description = 'показываю вам эффекты из книги'
        this._aliases = [
            'эффект'
        ]
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const itemId = 'effectBook'
        const [has] = await InventoryItemService.use(chatId, id, itemId)
        const filename = has ? 
            'text/commands/effectBook/start.pug' : 
            'text/commands/effectBook/hasnt.pug'

        const inlineKeyboard = has ?
            await InlineKeyboardManager.get(
                'effects/start',
                {
                    id
                }
            ) :
            undefined

        await MessageUtils.answerMessageFromResource(
            ctx,
            filename,
            {
                inlineKeyboard
            }
        )
    }
}