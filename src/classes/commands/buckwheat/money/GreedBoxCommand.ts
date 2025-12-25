import MathUtils from '../../../../utils/MathUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import { MAX_GREED_BOX } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class GreedBoxCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'шкатулка'
        this._description = 'шкатулка жадности дает деньги ее владельцу'
        this._argumentText = 'деньги'
        this._needData = true
        this._isPremium = true
    }

    async execute({ ctx, other, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        const greedBoxAllow = await ChatSettingsService.get<'boolean'>(
            chatId, 
            'useGreedBox'
        )

        if(!greedBoxAllow) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/greedBox/deny.pug'
            )
            return
        }

        const rawMoney = StringUtils.getNumberFromString(other ?? '1')
        const money = other && !isNaN(rawMoney) ? 
            MathUtils.clamp(Math.ceil(rawMoney), 1, MAX_GREED_BOX) : 
            -1
        const [hasBox] = await InventoryItemService.use(chatId, id, 'greedBox')

        if(!hasBox) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/greedBox/cant.pug'
            )
            return
        }

        if(money < 0) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/greedBox/no-other.pug'
            )
            return
        }

        await CasinoAddService.money(chatId, id, money)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/greedBox/done.pug',
            {
                changeValues: {
                    money: StringUtils.toFormattedNumber(money)
                }
            }
        )
    }
}