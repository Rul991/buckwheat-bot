import MessageUtils from '../../../../utils/MessageUtils'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'effects'

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
        const [has] = await InventoryItemService.use({
            chatId, 
            id, 
            itemId
        })
        const filename = has ? 
            'text/commands/effectBook/start.pug' : 
            'text/commands/effectBook/hasnt.pug'

        const inlineKeyboard = has ?
            await LegacyInlineKeyboardManager.get(
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