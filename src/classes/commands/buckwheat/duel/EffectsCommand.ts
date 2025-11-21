import { InlineKeyboardButton } from 'telegraf/types'
import ClassUtils from '../../../../utils/ClassUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString, ClassTypes, CallbackButtonValue } from '../../../../utils/values/types'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import SkillUtils from '../../../../utils/SkillUtils'

export default class extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'эффекты'
        this._description = 'показываю вам эффекты из книги'
        this._aliases = [
            'эффект'
        ]
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const itemId = 'effectBook'
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

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