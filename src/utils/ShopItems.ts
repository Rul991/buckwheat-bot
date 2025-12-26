import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import { DEFAULT_MAX_COUNT, DEFAULT_PREMIUM_DISCOUNT, DEFAULT_TOTAL_COUNT, DEFAULT_TOTAL_COUNT_MODE, FOREVER } from './values/consts'
import MessageUtils from './MessageUtils'
import { ItemCallbackOptions, ShopItem, ShopItemWithLength, JsonShopItem, ShopItemDescription, ShopMessageOptions, AsyncOrSync } from './values/types/types'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import LevelService from '../classes/db/services/level/LevelService'
import LevelUtils from './level/LevelUtils'
import StringUtils from './StringUtils'
import ObjectValidator from './ObjectValidator'
import { jsonShopItemSchema } from './values/schemas'
import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'
import CasinoGetService from '../classes/db/services/casino/CasinoGetService'
import AdminUtils from './AdminUtils'
import ChatSettingsService from '../classes/db/services/settings/ChatSettingsService'
import PremiumChatService from '../classes/db/services/chat/PremiumChatService'

type ItemDescriptionKey = string

type HasEnoughItemsOptions = {
    chatId: number
    id: number
    item: ShopItem
    count: number
}

const buyCard = async ({
    count,
    cardCount,
    id,
    chatId
}: ItemCallbackOptions & { cardCount: number }) => {
    const totalCount = cardCount * count

    const [isBought] = await InventoryItemService.add(
        chatId,
        id,
        'cardBox',
        totalCount
    )
    return isBought
}

export default class ShopItems {
    private static _getDefaultItem(): ShopItem {
        return {
            id: '???',
            name: '???',
            description: '???',
            emoji: '🥀',
            price: 0,
            maxCount: 1,
            premiumDiscount: 0,
            isPremium: true,
            totalCount: 0,
            totalCountMode: 'chat',
            execute: () => false
        }
    }

    private static _itemDescriptions: ShopItemDescription[] = [
        {
            execute: async ({ ctx, count: boughtCount, chatId, id }) => {
                const [_isBought, count] = await InventoryItemService.add(
                    chatId,
                    id,
                    'cookie',
                    boughtCount
                )

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
            execute: async ({ ctx, chatId, id }) => {
                await InventoryItemService.add(chatId, id, 'workUp')
                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/work/workUp.pug'
                )

                return true
            },
            filename: 'workUp'
        },

        {
            execute: async ({ ctx, chatId, id }) => {
                await InventoryItemService.add(chatId, id, 'workCatalog')
                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/work/workCatalog.pug'
                )

                return true
            },
            filename: 'workCatalog'
        },

        {
            execute: async ({ ctx, chatId, id }) => {
                const [isUpdated] = await InventoryItemService.add(chatId, id, 'manyCasino')
                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/casino/many.pug'
                )

                return isUpdated
            },
            filename: 'manyCasino'
        },

        {
            execute: async ({ ctx, chatId, id }) => {
                const [isUpdated] = await InventoryItemService.add(chatId, id, 'infinityCasino')

                await ContextUtils.showCallbackMessageFromFile(
                    ctx,
                    'text/commands/items/casino/infinity.pug'
                )

                return isUpdated
            },
            filename: 'infinityCasino'
        },

        {
            execute: async ({ ctx, id, chatId }) => {
                const hasSetting = await ChatSettingsService.get<'boolean'>(
                    chatId,
                    'canBuyUnmute'
                )

                if (!hasSetting) {
                    return await FileUtils.readPugFromResource(
                        'text/commands/items/unmute/has-setting.pug'
                    )
                }

                const canUnmute = await AdminUtils.unmute(
                    ctx,
                    id
                )

                if (!canUnmute) {
                    return await FileUtils.readPugFromResource(
                        'text/commands/items/unmute/cant-unmute.pug'
                    )
                }

                return canUnmute
            },
            filename: 'unban'
        },

        {
            execute: async ({ ctx, id, user, item }) => {
                const isBanned = await AdminUtils.ban(ctx, id, FOREVER)

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/ban/done.pug',
                    {
                        changeValues: {
                            isBanned,
                            user,
                            item: item.name
                        }
                    }
                )

                return true
            },
            filename: 'ban'
        },

        {
            execute: async ({
                ctx,
                item,
                count,
                id,
                chatId
            }) => {
                const [_, boostCount] = await InventoryItemService.add(chatId, id, 'levelBoost', count)

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
            execute: async ({ ctx, user, count, chatId, id }) => {
                const itemId = 'shopPrecent'

                if (await LevelService.get(chatId, id) < LevelUtils.max) {
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/shopPrecent/level-issue.pug'
                    )

                    return false
                }

                await InventoryItemService.add(chatId, id, itemId, count)

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
            execute: async ({ ctx, user, chatId, id }) => {
                const [isUpdated] = await InventoryItemService.add(chatId, id, 'greedBox')

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
            execute: async ({ ctx, id, chatId }) => {
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

        {
            filename: "cards/1",
            execute: async (options) => {
                return await buyCard({
                    ...options,
                    cardCount: 1
                })
            }
        },

        {
            filename: "cards/3",
            execute: async (options) => {
                return await buyCard({
                    ...options,
                    cardCount: 3
                })
            }
        },

        {
            filename: "cards/5",
            execute: async (options) => {
                return await buyCard({
                    ...options,
                    cardCount: 5
                })
            }
        }

        // {
        //     execute: async ({ ctx, id, chatId }) => {
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
        //     execute: async ({ ctx, id, chatId }) => {
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

    static async getByFilename(filename: string) {
        return this._itemDescriptions.find(v => v.filename == filename)
    }

    static async get(id: number): Promise<ShopItem> {
        const description = this._itemDescriptions[id]
        if (!description) return this._getDefaultItem()

        const item = description.item ??
            await this._valid(description)
        if (!item) return this._getDefaultItem()

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

    static getMaxCount(item: ShopItem): number {
        const maxCount = item.maxCount <= 0 ? Number.MAX_SAFE_INTEGER : item.maxCount
        const totalCount = item.totalCount <= DEFAULT_TOTAL_COUNT ? Infinity : item.totalCount
        return Math.min(
            maxCount,
            totalCount
        )
    }

    static getCount(item: ShopItem, count: number): number {
        const maxCount = this.getMaxCount(item)
        return Math.min(
            count,
            maxCount
        )
    }

    static async getRestAndCurrent(chatId: number, id: number, item: ShopItem) {
        const minValue = 0

        const { totalCount, id: itemId } = item
        const isChatMode = this.isChatMode(item)

        const count = isChatMode ?
            await InventoryItemService.getTotalCount(chatId, itemId) :
            (await InventoryItemService.get(chatId, id, itemId))?.count ?? minValue

        return {
            rest: item.totalCount === DEFAULT_TOTAL_COUNT ?
                Infinity :
                Math.max(totalCount - count, minValue),
            current: count
        }
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

    static getFormattedPriceByCount(item: ShopItem, count: number, hasPremium: boolean,): string {
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
        const {
            rest
        } = await this.getRestAndCurrent(chatId, id, item)
        return rest >= count
    }

    static async getAll(): Promise<ShopItem[]> {
        const result: ShopItem[] = []

        for (let i = 0; i < this._itemDescriptions.length; i++) {
            const item = await this.get(i)
            result.push(item)
        }

        return result
    }

    static async getShopMessage(options: ShopMessageOptions) {
        const updateIfInfinity = true
        const {
            index,
            chatId,
            userId,
            count,
            page,
        } = options

        const item = await ShopItems.get(index)
        if (!item) return null

        const { rest, current } = await ShopItems.getRestAndCurrent(chatId, userId, item)
        const isRestInfinity = !isFinite(rest)

        if (isRestInfinity && !updateIfInfinity) {
            return null
        }

        const hasPremium = await PremiumChatService.isPremium(chatId)
        const totalCount = ShopItems.getCount(item, count)
        const maxCount = ShopItems.getMaxCount(item)
        const totalPrice = ShopItems.getFormattedPriceByCount(item, count, hasPremium)
        const isChatMode = ShopItems.isChatMode(item)
        const balance = await CasinoGetService.money(chatId, userId)

        const rawCounts = [
            1, 2, 5, 10, 20, 50,
            100, 200, 500, 1000,
            2000, 5000
        ].sort((a, b) => a - b)

        const counts = rawCounts
            .filter(v => {
                return v != count &&
                    v <= maxCount
            })

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
                        hasPremium,
                        balance: StringUtils.toFormattedNumber(balance),
                        currentCount: StringUtils.toFormattedNumber(current)
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.map('shop/show', {
                        values: {
                            count: counts
                                .map(v => {
                                    return {
                                        text: `${v}`,
                                        data: `${v}`,
                                    }
                                }),
                            countTitle: counts.length > 0 ? [{ text: '', data: '' }] : []
                        },
                        globals: {
                            pageNum: page,
                            idNum: userId,
                            indexNum: index,
                            countNum: count
                        },
                        maxWidth: 4
                    })
                },
            }
        }
    }

    static async execute(item: ShopItem, options: ItemCallbackOptions): Promise<boolean> {
        const result = await item.execute(options)

        if (typeof result == 'string') {
            const {
                ctx
            } = options

            await ContextUtils.showCallbackMessage(
                ctx,
                result,
                true
            )

            return false
        }
        return result
    }
}