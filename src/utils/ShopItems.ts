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
import InventoryItemsUtils from './InventoryItemsUtils'

type ItemDescriptionKey = string

type HasEnoughItemsOptions = {
    chatId: number
    id: number
    item: ShopItem
    count: number
}

const buyItem = async (
    {
        chatId,
        id,
        count,
        item: {
            itemName
        }
    }: ItemCallbackOptions
) => {
    const [isBought] = await InventoryItemService.add({
        chatId,
        id,
        itemId: itemName,
        count
    })

    return isBought
}

const buyCard = async (options: ItemCallbackOptions & { cardCount: number }) => {
    const {
        count,
        cardCount
    } = options
    const totalCount = cardCount * count

    return buyItem(
        {
            ...options,
            count: totalCount
        }
    )
}

const buyItemAndAlert = async (
    options: ItemCallbackOptions & {
        path?: (itemId: string) => string
    }
) => {
    const {
        item: {
            itemName: itemId
        },
        path = itemId => `work/${itemId}`,
        ctx
    } = options

    const isBought = await buyItem(
        options
    )

    if (isBought) {
        await ContextUtils.showCallbackMessageFromFile(
            ctx,
            `text/commands/items/${path(itemId)}.pug`
        )
    }

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
            premiumDiscount: DEFAULT_PREMIUM_DISCOUNT,
            isPremium: true,
            execute: () => false,
            itemName: DEFAULT_ITEMNAME
        }
    }

    private static _itemDescriptions: ShopItemDescription[] = [
        {
            execute: async ({ count, chatId, id, ctx }) => {
                const [_isBought, totalCount] = await InventoryItemService.add({
                    chatId,
                    id,
                    itemId: 'cookie',
                    count
                })

                const text = await FileUtils.readPugFromResource(
                    'text/commands/items/cookie.pug',
                    {
                        changeValues: {
                            count: totalCount
                        }
                    }
                )

                await ContextUtils.showCallbackMessage(
                    ctx,
                    text
                )

                return true
            },
            filename: 'cookie'
        },

        {
            execute: async (options) => {
                return await buyItemAndAlert(options)
            },
            filename: 'workUp'
        },

        {
            execute: async (options) => {
                return await buyItemAndAlert(options)
            },
            filename: 'workCatalog'
        },

        {
            execute: async (options) => {
                return await buyItemAndAlert({
                    ...options,
                    path: itemId => `casino/${itemId}`
                })
            },
            filename: 'manyCasino'
        },

        {
            execute: async (options) => {
                return await buyItemAndAlert({
                    ...options,
                    path: itemId => `casino/${itemId}`
                })
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
            execute: async (options) => {
                return await buyItemAndAlert({
                    ...options,
                    path: _ => 'effectBook/bought'
                })
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
                    options
                )
            }
        },

        {
            filename: "moneyGrind/device",
            execute: async (options) => {
                return await buyItem(
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
            `json/shop-items/${key}.json`
        )

        if (jsonItem && this._isValid(jsonItem))
            return jsonItem
        else return null
    }

    private static async _valid({ execute, filename }: ShopItemDescription): Promise<ShopItem | null> {
        const item = await this._readFromFile(filename)

        if (item) {
            const {
                isPremium,
                premiumDiscount,
                itemName,
                name,
                description
            } = item

            const itemId = itemName ?? filename
            const itemDescription = InventoryItemsUtils.getItemDescription(itemId)

            return {
                ...item,
                isPremium: isPremium ?? false,
                premiumDiscount: premiumDiscount ?? DEFAULT_PREMIUM_DISCOUNT,
                itemName: itemId,
                execute,
                id: filename,
                name: name ?? itemDescription.name,
                description: description ?? itemDescription.description,
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

    static async getRestAndCurrentCount(chatId: number, id: number, item: ShopItem) {
        const { itemName: itemId } = item
        return await InventoryItemService.getRestAndCurrentCount(
            chatId,
            id,
            itemId
        )
    }

    static getPriceByCount(item: ShopItem, count: number, hasPremium: boolean): number {
        return count * this.getPrice(hasPremium, item)
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
        const totalPrice = ShopItems.getFormattedPriceByCount(item, count, hasPremium)
        const balance = await CasinoGetService.money(chatId, userId)

        const maxLength = MAX_COUNT_BUTTONS_LENGTH
        const maxValue = rest

        const counts = ArrayUtils.generateMultipliedSequence({
            maxLength,
            maxValue,
            avoidNumber: count,
            isAddLastValue: isFinite(maxValue)
        })

        return {
            text: await FileUtils.readPugFromResource(
                'text/commands/shop/shop.pug',
                {
                    changeValues: {
                        ...item,
                        isRestInfinity,
                        rest,
                        count: count,
                        price: item.price,
                        totalPrice,
                        index,
                        length: ShopItems.len(),
                        hasPremium,
                        balance,
                        currentCount: current
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
                                        text: `${StringUtils.toFormattedNumber(v)}`,
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