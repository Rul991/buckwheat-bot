import { MaybeString, TextContext } from '../../../../utils/values/types/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { DEV_ID, MODE } from '../../../../utils/values/consts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MessageUtils from '../../../../utils/MessageUtils'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import ExperienceService from '../../../db/services/level/ExperienceService'
import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { InlineKeyboardButton } from 'telegraf/types'
import MathUtils from '../../../../utils/MathUtils'
import StringUtils from '../../../../utils/StringUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import ContextUtils from '../../../../utils/ContextUtils'
import InventoryItemService from '../../../db/services/items/InventoryItemService'

type SecretFunctionOptions = {
    ctx: TextContext
    other: MaybeString
    chatId: number
    id: number
}

export default class TestCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'дев'
        this._isShow = false
    }

    private async _secretFunction({
        ctx,
        chatId,
        id,
        other
    }: SecretFunctionOptions) {
        await InventoryItemService.add(chatId, id, 'cardBox', 1_000_000)
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if (MODE == 'dev') {
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(ctx, id)
            if (!chatId) return

            await this._secretFunction({ ctx, other, chatId, id })
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/dev/${MODE}.pug`,
            {
                changeValues: {
                    name: ctx.message.text
                }
            }
        )
    }
}