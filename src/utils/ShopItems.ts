import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import { DEFAULT_DESCRIPTION, DEFAULT_ITEMNAME, DEFAULT_MAX_COUNT, DEFAULT_PREMIUM_DISCOUNT, DEFAULT_TOTAL_COUNT, DEFAULT_TOTAL_COUNT_MODE, FOREVER, MAX_COUNT_BUTTONS_LENGTH } from './values/consts'
import MessageUtils from './MessageUtils'
import { ItemCallbackOptions, ShopItem, ShopItemWithLength, JsonShopItem, ShopItemDescription, ShopMessageOptions } from './values/types/types'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import LevelService from '../classes/db/services/level/LevelService'
import LevelUtils from './level/LevelUtils'
import StringUtils from './StringUtils'
import ObjectValidator from './ObjectValidator'
import { jsonShopItemSchema } from './values/schemas'
import LegacyInlineKeyboardManager from '../classes/main/LegacyInlineKeyboardManager'
import CasinoGetService from '../classes/db/services/casino/CasinoGetService'
import AdminUtils from './AdminUtils'
import ChatSettingsService from '../classes/db/services/settings/ChatSettingsService'
import PremiumChatService from '../classes/db/services/chat/PremiumChatService'
import ArrayUtils from './ArrayUtils'
import UserClassService from '../classes/db/services/user/UserClassService'
import ExperienceService from '../classes/db/services/level/ExperienceService'
import ExperienceUtils from './level/ExperienceUtils'
import DuelistService from '../classes/db/services/duelist/DuelistService'
import DuelCheckService from '../classes/db/services/duel/DuelCheckService'

type ItemDescriptionKey = string

type HasEnoughItemsOptions = {
    chatId: number
    id: number
    item: ShopItem
    count: number
}

const buyItem = async (
    itemId: string,
    {
        chatId,
        id,
        count
    }: ItemCallbackOptions
) => {
    const [isBought] = await InventoryItemService.add({
        chatId,
        id,
        itemId,
        count
    })

    return isBought
}

const buyCard = async ({
    count,
    cardCount,
    id,
    chatId
}: ItemCallbackOptions & { cardCount: number }) => {
    const totalCount = cardCount * count

    const [isBought] = await InventoryItemService.add({
        chatId,
        id,
        itemId: 'cardBox',
        count: totalCount
    })
    return isBought
}

export default class ShopItems {
    private static _getDefaultItem(): ShopItem {
        return {
            id: '???',
            name: '???',
            description: DEFAULT_DESCRIPTION,
            emoji: '🥀',
            price: 0,
            maxCount: DEFAULT_MAX_COUNT,
            premiumDiscount: DEFAULT_PREMIUM_DISCOUNT,
            isPremium: true,
            totalCount: DEFAULT_TOTAL_COUNT,
            totalCountMode: DEFAULT_TOTAL_COUNT_MODE,
            execute: () => false,
            itemName: DEFAULT_ITEMNAME
        }
    }

    private static _itemDescriptions: ShopItemDescription[] = [
        {
            execute: async ({ ctx, count: boughtCount, chatId, id }) => {
                const [_isBought, count] = await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'cookie',
                    count: boughtCount
                })

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
                await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'workUp'
                })
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
                await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'workCatalog'
                })
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
                const [isUpdated] = await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'manyCasino'
                })
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
                const [isUpdated] = await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'infinityCasino'
                })

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
                    'cbu'
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
            execute: async ({ ctx, chatId, id, user, item }) => {
                const isBanned = await AdminUtils.ban(ctx, id, FOREVER)

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/ban/done.pug',
                    {
                        changeValues: {
                            isBanned,
                            user,
                            item: item.name
                        },
                        chatId,
                        isReply: false
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
                const [_, boostCount] = await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'levelBoost',
                    count
                })

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

                await InventoryItemService.add({
                    chatId,
                    id,
                    itemId,
                    count
                })

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/shopPrecent/done.pug',
                    {
                        changeValues: {
                            user,
                            precent: count
                        },
                        chatId,
                        isReply: false
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
                const [isUpdated] = await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'greedBox'
                })

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/greedBox/greedBox.pug',
                    {
                        changeValues: user,
                        chatId,
                        isReply: false
                    }
                )

                return isUpdated
            },
            filename: 'greedBox'
        },

        {
            execute: async ({ ctx, id, chatId }) => {
                const [isBought] = await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'effectBook'
                })
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
        },

        {
            filename: "moneyGrind/license",
            execute: async options => {
                return await buyItem(
                    'moneyGrindLicense',
                    options
                )
            }
        },

        {
            filename: "moneyGrind/device",
            execute: async (options) => {
                return await buyItem(
                    'moneyGrindDevice',
                    options
                )
            }
        },

        {
            filename: "classReset",
            execute: async ({ chatId, id }) => {
                await Promise.allSettled([
                    UserClassService.update(
                        chatId,
                        id,
                        'unknown'
                    ),
                    ExperienceService.set(
                            chatId,
                            id,
                            ExperienceUtils.min
                        )
                ])

                return true
            }
        },

        {
            filename: "save-cooldown",
            execute: async ({
                chatId,
                id
            }) => {
                await DuelistService.setField(
                    chatId,
                    id,
                    'lastSave',
                    0
                )
                return true
            }
        }

        // {
        //     execute: async ({ ctx, id, chatId }) => {
        //         const [hasGreedBox] = await InventoryItemService.use({
        //              chatId,
        //              id,
        //              itemId: 'greedBox'
        //         })
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
                premiumDiscount,
                itemName
            } = item

            return {
                ...item,
                maxCount: maxCount ?? DEFAULT_MAX_COUNT,
                isPremium: isPremium ?? false,
                totalCount: totalCount ?? DEFAULT_TOTAL_COUNT,
                totalCountMode: totalCountMode ?? DEFAULT_TOTAL_COUNT_MODE,
                premiumDiscount: premiumDiscount ?? DEFAULT_PREMIUM_DISCOUNT,
                itemName: itemName ?? filename,
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

    static async getRestAndCurrentCount(chatId: number, id: number, item: ShopItem) {
        const minValue = 0

        const { totalCount, itemName: itemId } = item
        const isChatMode = this.isChatMode(item)

        const userCount = (await InventoryItemService.get(chatId, id, itemId))?.count ?? minValue
        const count = isChatMode ?
            await InventoryItemService.getTotalCount(chatId, itemId) :
            userCount

        return {
            rest: item.totalCount === DEFAULT_TOTAL_COUNT ?
                Infinity :
                Math.max(totalCount - count, minValue),
            current: userCount
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
        } = await this.getRestAndCurrentCount(chatId, id, item)
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

        const { rest, current } = await ShopItems.getRestAndCurrentCount(chatId, userId, item)
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

        const maxLength = MAX_COUNT_BUTTONS_LENGTH
        const maxValue = Math.min(maxCount, rest)

        const counts = ArrayUtils.generateMultipliedSequence({
            maxLength,
            maxValue,
            avoidNumber: count
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
                    inline_keyboard: await LegacyInlineKeyboardManager.map('shop/show', {
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