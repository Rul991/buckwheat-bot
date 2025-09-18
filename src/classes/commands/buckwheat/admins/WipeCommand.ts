import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import CasinoWipeService from '../../../db/services/casino/CasinoWipeService'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import ItemsService from '../../../db/services/items/ItemsService'
import LevelService from '../../../db/services/level/LevelService'
import UserRankService from '../../../db/services/user/UserRankService'
import WorkService from '../../../db/services/work/WorkService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class WipeCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'вайп'
        this._isShow = false
    }

    private async _wipe(chatId: number) {
        await LevelService.wipe(chatId)
        await ItemsService.wipe(chatId)
        await WorkService.wipe(chatId)
        await CasinoWipeService.money(chatId)
    }

    private async _giveNewGameIfGreedBox(chatId: number) {
        const userItemId = 'greedBox'
        const chatItemId = 'newGame'

        if(await InventoryItemService.anyHas(chatId, userItemId)) {
            await InventoryItemService.add(chatId, chatId, chatItemId)
        }
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/wipe/private.pug'
            )
            return
        }
        
        const chatId = ctx.chat.id
        const id = ctx.from.id
        const rank = await UserRankService.get(chatId, id)

        if(!RankUtils.canUse({
            adminRank: RankUtils.max,
            userRank: rank
        })) {
            const changeValues = await ContextUtils.getUserFromContext(ctx)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/wipe/not-admin.pug',
                {changeValues}
            )
            return
        }

        await this._wipe(chatId)
        await this._giveNewGameIfGreedBox(chatId)

        const changeValues = {
            chatTitle: ctx.chat.title
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/wipe/wipe.pug',
            {changeValues}
        )
    }
}