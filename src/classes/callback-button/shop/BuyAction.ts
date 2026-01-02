import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import { Link, ShopItem, ShopMessageOptions } from '../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import CallbackButtonAction from '../CallbackButtonAction'
import StringUtils from '../../../utils/StringUtils'
import FileUtils from '../../../utils/FileUtils'
import InventoryItemService from '../../db/services/items/InventoryItemService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import PremiumChatService from '../../db/services/chat/PremiumChatService'
import { NOT_FOUND_INDEX } from '../../../utils/values/consts'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Data = [number, number, number, number]

type MoneyValuesOptions = {
    chatId: number,
    id: number,
    item: ShopItem,
    count: number,
    hasPremium: boolean
}

type GetAlertMessageOptions = {
    hasRest: boolean
    money: number
    totalPrice: number
    name: string
    user: Link
    chatId: number
    item: ShopItem
    isChatMode: boolean
}

export default class BuyAction extends CallbackButtonAction<Data> {
    protected _schema: null = null

    constructor () {
        super()
        this._name = 'buy'
    }

    protected _getData(raw: string): Data {
        return raw
            .split('_', 4)
            .map(v => +v) as Data
    }

    protected async _getIds(ctx: CallbackButtonContext) {
        const id = ctx.from.id
        const botId = ctx.botInfo.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return null

        return {
            id,
            botId,
            chatId
        }
    }

    protected async _getItem(index: number) {
        const item = await ShopItems.get(index)
        if (!item) return await FileUtils.readPugFromResource('text/alerts/wrong-item.pug')

        return item
    }

    protected async _getMoneyValues({
        chatId,
        id,
        item,
        count: totalCount,
        hasPremium
    }: MoneyValuesOptions) {
        const money = await CasinoGetService.money(chatId, id)
        const totalPrice = ShopItems.getPriceByCount(item, totalCount, hasPremium)

        return {
            totalPrice,
            money
        }
    }

    protected async _editMessage(ctx: CallbackButtonContext, shopOptions: ShopMessageOptions) {
        const shopMessage = await ShopItems.getShopMessage({
            ...shopOptions,
            updateIfInfinity: false
        })
        if(!shopMessage) return

        const {
            text,
            options
        } = shopMessage

        await MessageUtils.editText(
            ctx,
            text,
            options
        )
    }

    protected async _getAlertMessage({
        name,
        isChatMode,
        hasRest,
        user,
        totalPrice,
        money,
        item,
        chatId
    }: GetAlertMessageOptions) {
        if (!hasRest) {
            return await FileUtils.readPugFromResource(
                'text/commands/shop/no-items.pug',
                {
                    changeValues: {
                        name,
                        isChatMode,
                        user
                    }
                }
            )
        }

        if (totalPrice > money) {
            return await FileUtils.readPugFromResource(
                'text/commands/shop/no-money.pug',
                {
                    changeValues: {
                        name,
                        elapsedMoney: StringUtils.toFormattedNumber(totalPrice - money),
                        user
                    }
                }
            )
        }

        if (item.isPremium && !(await PremiumChatService.isPremium(chatId))) {
            return await FileUtils.readPugFromResource(
                'text/commands/shop/no-premium.pug',
                {
                    changeValues: {
                        name
                    }
                }
            )
        }

        return ''
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const ids = await this._getIds(ctx)
        if (!ids) return
        const {
            botId,
            chatId,
            id
        } = ids
        const [index, scrollingUserId, rawCount, page] = data
        const count = Math.max(1, rawCount)

        if (index === NOT_FOUND_INDEX) return

        const item = await this._getItem(index)
        if (typeof item == 'string') return item

        const {
            name
        } = item

        const user = await ContextUtils.getUser(chatId, id)
        const totalCount = ShopItems.getCount(item, count)
        const hasPremium = await PremiumChatService.isPremium(chatId)

        const hasItemsOptions = {
            chatId,
            id,
            item,
            count: totalCount,
            hasPremium
        }

        const {
            money,
            totalPrice
        } = await this._getMoneyValues(hasItemsOptions)

        const isChatMode = ShopItems.isChatMode(item)
        const hasRest = await ShopItems.hasEnoughItems(hasItemsOptions)

        const alertMessage = await this._getAlertMessage({
            name,
            isChatMode,
            hasRest,
            user,
            totalPrice,
            money,
            item,
            chatId
        })

        if(alertMessage.length > 0) {
            await ContextUtils.showCallbackMessage(
                ctx,
                alertMessage,
                true
            )
            return
        }

        const isBought = await ShopItems.execute(item, {
            ctx,
            user,
            item,
            count: totalCount,
            id,
            chatId
        })

        if (isBought) {
            const itemId = 'shopPrecent'
            const owners = await InventoryItemService.getOwners(chatId, itemId)
            let remainingPrice = totalPrice

            for await (const { id, count } of owners) {
                const stake = Math.floor(totalPrice * (count / 100))
                remainingPrice -= stake
                await CasinoAddService.money(chatId, id, stake)
            }

            await CasinoAddService.money(chatId, botId, remainingPrice)
            await CasinoAddService.money(chatId, id, -totalPrice)

            await this._editMessage(
                ctx,
                {
                    chatId,
                    userId: scrollingUserId,
                    index,
                    count,
                    page
                }
            )

            return await FileUtils.readPugFromResource(
                'text/alerts/bought.pug',
                {
                    changeValues: {
                        ...item
                    }
                }
            )
        }
        else {
            return await FileUtils.readPugFromResource('text/commands/shop/return.pug')
        }
    }
}