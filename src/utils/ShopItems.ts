import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import AdminUtils from './AdminUtils'
import { DEFAULT_MAX_COUNT, DEFAULT_PREMIUM_DISCOUNT, DEFAULT_TOTAL_COUNT, DEFAULT_TOTAL_COUNT_MODE, MAX_SHOP_PRECENTS, MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from './values/consts'
import MessageUtils from './MessageUtils'
import { ItemCallbackOptions, ShopItem, ShopItemWithLength, JsonShopItem, ShopItemDescription, ShopMessageOptions } from './values/types'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import LevelService from '../classes/db/services/level/LevelService'
import LevelUtils from './level/LevelUtils'
import StringUtils from './StringUtils'
import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import ObjectValidator from './ObjectValidator'
import { jsonShopItemSchema } from './values/schemas'
import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'

type ItemDescriptionKey = string

type HasEnoughItemsOptions = {
    chatId: number
    id: number
    item: ShopItem
    count: number
}

export default class ShopItems {
    private static _itemDescriptions: ShopItemDescription[] = [
        {
            execute: async ({ ctx, count: boughtCount }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                const [_isBought, count] = await InventoryItemService.add(chatId, ctx.from.id, 'cookie', boughtCount)

                await ContextUtils.showCallbackMessage(
                    ctx,
                    await FileUtils.readPugFromResource(
                        'text/commands/items/cookie.pug',
                        {
                            changeValues: {
                                count
                            }
                        }
                    )
                )

                return true
            },
            filename: 'cookie'
        },

        {
            execute: async ({ ctx }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                await InventoryItemService.add(chatId, ctx.from.id, 'workUp')
                await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/work/workUp.pug'
                    )

                return true
            },
            filename: 'workUp'
        },

        {
            execute: async ({ ctx }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                await InventoryItemService.add(chatId, ctx.from.id, 'workCatalog')
                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/work/workCatalog.pug'
                )

                return true
            },
            filename: 'workCatalog'
        },

        {
            execute: async ({ ctx }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                const [isUpdated] = await InventoryItemService.add(chatId, ctx.from.id, 'manyCasino')
                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/casino/many.pug'
                )

                return isUpdated
            },
            filename: 'manyCasino'
        },

        {
            execute: async ({ ctx }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                const [isUpdated] = await InventoryItemService.add(chatId, ctx.from.id, 'infinityCasino')

                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/casino/infinity.pug'
                )

                return isUpdated
            },
            filename: 'infinityCasino'
        },

        {
            execute: async ({ ctx, user, count }) => {
                return false
            },
            filename: 'ban'
        },

        {
            execute: async ({ ctx, user }) => {
                return false
            },
            filename: 'unban'
        },

        {
            execute: async ({ ctx, item, count }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                const [_, boostCount] = await InventoryItemService.add(chatId, ctx.from.id, 'levelBoost', count)

                await ContextUtils.showCallbackMessage(
                    ctx,
                    await FileUtils.readPugFromResource(
                        'text/commands/items/default/default-count.pug',
                        {
                            changeValues: {
                                count: boostCount,
                                name: item.name
                            }
                        }
                    )
                )

                return true
            },
            filename: 'levelBoost'
        },

        {
            execute: async ({ ctx, user, count }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false

                const itemId = 'shopPrecent'

                if (await LevelService.get(chatId, ctx.from.id) < LevelUtils.max) {
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/shopPrecent/level-issue.pug'
                    )

                    return false
                }

                await InventoryItemService.add(chatId, ctx.from.id, itemId, count)

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/shopPrecent/done.pug',
                    {
                        changeValues: {
                            user,
                            precent: count
                        }
                    }
                )

                return true
            },
            filename: 'shopPrecent'
        },

        {
            execute: async ({ ctx, user }) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/thanks.pug',
                    {
                        changeValues: user
                    }
                )

                return true
            },
            filename: 'thanks'
        },

        {
            execute: async ({ ctx, user }) => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if (!chatId) return false
                const [isUpdated] = await InventoryItemService.add(chatId, ctx.from.id, 'greedBox')

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/greedBox/greedBox.pug',
                    {
                        changeValues: user
                    }
                )

                return isUpdated
            },
            filename: 'greedBox'
        },

        {
            execute: async ({ ctx }) => {
                const id = ctx.from.id
                const chatId = await LinkedChatService.getCurrent(ctx, id)
                if (!chatId) return false

                const [isBought] = await InventoryItemService.add(chatId, id, 'effectBook')
                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/effectBook/bought.pug',
                    false
                )

                return isBought
            },
            filename: 'effectBook'
        },

        // {
        //     execute: async ({ ctx }) => {
        //         const id = ctx.from.id
        //         const chatId = await LinkedChatService.getCurrent(ctx, id)
        //         if (!chatId) return false

        //         const [hasGreedBox] = await InventoryItemService.use(chatId, id, 'greedBox')
        //         if (hasGreedBox) {
        //             await ContextUtils.showCallbackMessageFromFile(
        //                 ctx,
        //                 'text/commands/items/businessPaper/hasGreedBox.pug',
        //                 false
        //             )
        //             return false
        //         }

        //         const [isBought] = await InventoryItemService.add(chatId, id, 'businessPaper')
        //         await ContextUtils.showCallbackMessageFromFile(
        //             ctx,
        //             'text/commands/items/businessPaper/bought.pug',
        //             false
        //         )

        //         return isBought
        //     },
        //     filename: 'businessPaper'
        // },

        // {
        //     execute: async ({ ctx }) => {
        //         const id = ctx.from.id
        //         const chatId = await LinkedChatService.getCurrent(ctx, id)
        //         if (!chatId) return false

        //         const [isBought] = await InventoryItemService.add(chatId, id, 'corporation')
        //         await ContextUtils.showCallbackMessageFromFile(
        //             ctx,
        //             'text/commands/items/corporation/bought.pug',
        //             false
        //         )

        //         return isBought
        //     },
        //     filename: 'corporation'
        // },
    ]

    private static _isValid(item: JsonShopItem): boolean {
        return (
            ObjectValidator.isValidatedObject(item, jsonShopItemSchema)
        )
    }

    private static async _readFromFile(key: ItemDescriptionKey): Promise<JsonShopItem | null> {
        const jsonItem = await FileUtils.readJsonFromResource<JsonShopItem>(
            `json/shop_items/${key}.json`
        )

        if (jsonItem && this._isValid(jsonItem))
            return jsonItem
        else return null
    }

    private static async _valid({ execute, filename }: ShopItemDescription): Promise<ShopItem | null> {
        const item = await this._readFromFile(filename)

        if (item && this._isValid(item)) {
            const {
                maxCount,
                isPremium,
                totalCount,
                totalCountMode,
                premiumDiscount
            } = item

            return {
                ...item,
                maxCount: maxCount ?? DEFAULT_MAX_COUNT,
                isPremium: isPremium ?? false,
                totalCount: totalCount ?? DEFAULT_TOTAL_COUNT,
                totalCountMode: totalCountMode ?? DEFAULT_TOTAL_COUNT_MODE,
                premiumDiscount: premiumDiscount ?? DEFAULT_PREMIUM_DISCOUNT,
                execute,
                id: filename
            }
        }

        return null
    }

    static async get(id: number): Promise<ShopItem | null> {
        const description = this._itemDescriptions[id]
        if (!description) return null

        const item = description.item ?? 
            await this._valid(description)
        if (!item) return null

        this._itemDescriptions[id].item = item
        return this._itemDescriptions[id].item
    }

    static async getWithLength(id: number): Promise<ShopItemWithLength | null> {
        const item = await this.get(id)
        if (!item) return item

        return { ...item, length: this.len(), index: id }
    }

    static len(): number {
        return this._itemDescriptions.length
    }

    static getCount(item: ShopItem, count: number): number {
        const maxCount = item.maxCount <= 0 ? Number.MAX_SAFE_INTEGER : item.maxCount
        const totalCount = item.totalCount <= DEFAULT_TOTAL_COUNT ? Infinity : item.totalCount
        return Math.min(
            count, 
            maxCount, 
            totalCount
        )
    }

    static async getRest(chatId: number, id: number, item: ShopItem) {
        if(item.totalCount === DEFAULT_TOTAL_COUNT) return Infinity
        const minValue = 0

        const { totalCount, id: itemId } = item
        const isChatMode = this.isChatMode(item)

        const count = isChatMode ? 
            await InventoryItemService.getTotalCount(chatId, itemId) :
            (await InventoryItemService.get(chatId, id, itemId))?.count ?? minValue

        return Math.max(totalCount - count, minValue)
    }

    static getPriceByCount(item: ShopItem, count: number, hasPremium: boolean): number {
        return this.getCount(item, count) * this.getPrice(hasPremium, item)
    }

    static getPrice(hasPremium: boolean, item: ShopItem) {
        return Math.ceil(
            item.price * (
                hasPremium ? 
                    1 - item.premiumDiscount / 100 :
                    1
            )
        )
    }

    static getFormattedPriceByCount(item: ShopItem, count: number, hasPremium: boolean, ): string {
        return StringUtils.toFormattedNumber(this.getPriceByCount(item, count, hasPremium))
    }

    static isChatMode(item: ShopItem) {
        return item.totalCountMode == 'chat'
    }

    static async hasEnoughItems({
        chatId,
        id,
        item,
        count
    }: HasEnoughItemsOptions) {
        return await this.getRest(chatId, id, item) >= count
    }

    static async getShopMessage(options: ShopMessageOptions) {
        const {
            index,
            chatId,
            userId,
            count,
            updateIfInfinity = true,
            hasPremium
        } = options

        const item = await ShopItems.get(index)
        if(!item) return null

        const rest = await ShopItems.getRest(chatId, userId, item)
        const isRestInfinity = !isFinite(rest)

        if(isRestInfinity && !updateIfInfinity) {
            return null
        }

        const totalCount = ShopItems.getCount(item, count)
        const totalPrice = ShopItems.getFormattedPriceByCount(item, count, hasPremium)
        const isChatMode = ShopItems.isChatMode(item)

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/shop/shop.pug',
                {
                    changeValues: {
                        ...item,
                        isRestInfinity,
                        rest: StringUtils.toFormattedNumber(rest),
                        count: StringUtils.toFormattedNumber(totalCount),
                        price: StringUtils.toFormattedNumber(item.price),
                        totalPrice,
                        index,
                        length: ShopItems.len(),
                        isChatMode,
                        hasPremium
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get('shop', `${index}_${userId}_${count}`)
                },
            }
        }
    }

    static async execute(item: ShopItem, options: ItemCallbackOptions): Promise<boolean> {
        return await item.execute(options)
    }
}