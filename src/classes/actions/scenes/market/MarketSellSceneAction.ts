import ContextUtils from '../../../../utils/ContextUtils'
import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import MathUtils from '../../../../utils/MathUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import { MAX_MARKET_PRICE, MIN_MARKET_PRICE } from '../../../../utils/values/consts'
import { SceneOptions } from '../../../../utils/values/types/action-options'
import MarketSlotService from '../../../db/services/market/MarketSlotService'
import SceneAction from '../SceneAction'

type Data = {
    chatId: number
    id: number
    itemId: string
    count: number
}

export default class extends SceneAction<Data> {
    private readonly _notNumber = -1
    constructor() {
        super()
        this._name = 'market-sell'
    }

    protected async _execute(options: SceneOptions<Data>): Promise<void> {
        const {
            scene
        } = options

        scene.enter(async ctx => {
            const {
                itemId
            } = ctx.scene.state

            const item = InventoryItemsUtils.getItemDescription(itemId)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/scenes/market-sell/enter.pug',
                {
                    changeValues: {
                        ...item,
                        min: MIN_MARKET_PRICE,
                        max: MAX_MARKET_PRICE,
                    }
                }
            )
        })

        scene.on('text', async ctx => {
            const soldOptions = ctx.scene.state
            const {
                id: userId,
                chatId,
                itemId
            } = soldOptions

            const text = ctx.text
            const rawPrice = StringUtils.getNumberFromString(
                text, 
                this._notNumber
            )

            if(this._notNumber == rawPrice) {
                await ctx.scene.reenter()
                return
            }

            const price = MathUtils.clamp(
                rawPrice,
                MIN_MARKET_PRICE,
                MAX_MARKET_PRICE
            )

            const {
                reason,
            } = await MarketSlotService.create({
                ...soldOptions,
                userId,
                price
            })

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/scenes/market-sell/sold-result/${reason}.pug`,
                {
                    changeValues: {
                        ...soldOptions,
                        price,
                        item: InventoryItemsUtils.getItemDescription(itemId),
                        user: await ContextUtils.getUser(chatId, userId)
                    }
                }
            )

            await ctx.scene.leave()
        })
    }
}