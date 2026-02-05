import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'generator'

    constructor () {
        super()
        this._name = 'генератор'
        this._aliases = [
            'генераторы',
            'ген'
        ]
        this._description = 'открываю меню работы с генераторами монет'
        this._isPremium = true
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            chatId,
            id
        } = options

        const itemId = 'moneyGrindLicense'
        const [hasLicense] = await InventoryItemService.use({
            chatId,
            id,
            itemId
        })

        if (!hasLicense) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/generator/no-license.pug'
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/generator/start.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'generator/start',
                    {
                        id
                    }
                )
            }
        )
    }
}