import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import UserRankService from '../classes/db/services/user/UserRankService'
import AdminUtils from './AdminUtils'
import { MAX_SHOP_PRECENTS, MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from './values/consts'
import MessageUtils from './MessageUtils'
import RankUtils from './RankUtils'
import {  ItemExecuteOptions, RequiredShopItem, RequiredShopItemWithLength, ShopItem } from './values/types'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import LevelService from '../classes/db/services/level/LevelService'
import LevelUtils from './level/LevelUtils'
import StringUtils from './StringUtils'
import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import { sleep } from './values/functions'
import ObjectValidator from './ObjectValidator'
import { shopItemSchema } from './values/schemas'

export default class ShopItems {
    private static _items: ShopItem[] = [
        {
            filename: "rankUp",
            execute: async ({ctx}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                const rank = await UserRankService.get(chatId, ctx.from.id)
                if(rank >= RankUtils.moderator) return false

                const [isBought] = await InventoryItemService.add(chatId, ctx.from.id, 'rankUp')
                await UserRankService.update(chatId, ctx.from.id, rank + 1)

                if(isBought) 
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/default/default-count.pug'
                    )

                return isBought
            }
        },

        {
            filename: "thanks",
            execute: async ({ctx, user}) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/thanks.pug',
                    {
                        changeValues: user
                    }
                )

                return true
            }
        },

        {
            filename: "ban",
            execute: async ({ctx, user, count}) => {
                const isKicked = await AdminUtils.ban(
                    ctx, 
                    ctx.from.id, 
                    MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * count
                )

                if(isKicked) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/kick/kicked.pug',
                        {
                            changeValues: user
                        }
                    )
                }
                else {
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/kick/cant-kicked.pug',
                        true
                    )
                }

                return true
            }
        },

        {
            filename: 'manyCasino',
            execute: async ({ctx}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                const [isUpdated] = await InventoryItemService.add(chatId, ctx.from.id, 'manyCasino')

                if(isUpdated)
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/casino/many.pug'
                    )

                return isUpdated
            }
        },

        {
            filename: 'infinityCasino',
            execute: async ({ctx}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                const [isUpdated] = await InventoryItemService.add(chatId, ctx.from.id, 'infinityCasino')

                if(isUpdated)
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/casino/infinity.pug'
                    )

                return isUpdated
            }
        },

        {
            filename: 'greedBox',
            execute: async ({ctx, user}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                if(await InventoryItemService.anyHas(chatId, 'greedBox')) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/greedBox/empty.pug',
                        {
                            changeValues: user
                        }
                    )
                    return false
                }

                const [isUpdated] = await InventoryItemService.add(chatId, ctx.from.id, 'greedBox')

                if(isUpdated)
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/greedBox/greedBox.pug',
                        {
                            changeValues: user
                        }
                    )

                return isUpdated
            }
        },

        {
            filename: 'unban',
            execute: async ({ctx, user}) => {
                const unMuted = await AdminUtils.unmute(ctx, ctx.from.id)

                if(unMuted) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/default/default-user.pug',
                        {
                            changeValues: user
                        }
                    )
                }
                
                return unMuted
            },
        },

        {
            filename: 'cookie',
            execute: async ({ctx, count: boughtCount}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

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
            }
        },

        {
            filename: 'workUp',
            execute: async ({ctx}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                const [isAdded] = await InventoryItemService.add(chatId, ctx.from.id, 'workUp')

                if(isAdded) {
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/work/workUp.pug'
                    )
                }

                return isAdded
            }
        },

        {
            filename: 'workCatalog',
            execute: async ({ctx}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                const [isAdded] = await InventoryItemService.add(chatId, ctx.from.id, 'workCatalog')

                if(isAdded) {
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/work/workCatalog.pug'
                    )
                }

                return isAdded
            }
        },

        {
            filename: 'levelBoost',
            execute: async ({ctx, item, count}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

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
            }
        },

        {
            filename: 'aeHair',
            execute: async ({ctx, user}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                const itemId = 'aeHair'
                if(await InventoryItemService.anyHas(chatId, itemId)) {
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/aeHair/empty.pug'
                    )
                    return false
                }

                const [isAdded] = await InventoryItemService.add(chatId, ctx.from.id, itemId)

                if(isAdded) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/aeHair/done.pug',
                        {
                            changeValues: user
                        }
                    )
                }

                return isAdded
            }
        },

        {
            filename: 'shopPrecent',
            execute: async ({ctx, user, count}) => {
                const chatId = await LinkedChatService.getChatId(ctx)
                if(!chatId) return false

                const itemId = 'shopPrecent'

                const currentCount = await InventoryItemService.getTotalCount(chatId, itemId)
                const totalCount = currentCount + count

                if(totalCount > MAX_SHOP_PRECENTS) {
                    await ContextUtils.showCallbackMessage(
                        ctx,
                        await FileUtils.readPugFromResource(
                            'text/commands/items/shopPrecent/max.pug',
                            {
                                changeValues: {
                                    elapsed: MAX_SHOP_PRECENTS - currentCount
                                }
                            }
                        )
                    )
                    return false
                }

                if(await LevelService.get(chatId, ctx.from.id) < LevelUtils.max) {
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
                            ...user,
                            precent: count
                        }
                    }
                )

                return true
            }
        },
    ]

    private static _hasFileName(item: ShopItem): boolean {
        return Boolean(item.filename)
    }

    private static _isValid(item: ShopItem): boolean {
        return (
            ObjectValidator.isValidatedObject(item, shopItemSchema)
        )
    }

    private static async _readFromFile(item: ShopItem): Promise<RequiredShopItem | null> {
        if(!this._hasFileName(item)) return null

        const jsonItem = await FileUtils.readJsonFromResource<RequiredShopItem>(
            `json/shop_items/${item.filename}.json`
        )

        if(jsonItem && this._isValid(jsonItem)) 
            return {
                ...jsonItem, 
                ...item
            }
        else return null
    }

    private static async _valid(item: ShopItem): Promise<RequiredShopItem | null> {
        if(this._isValid(item)) {
            return {
                ...item,
                cooldown: item.cooldown ?? 0,
                execute: item.execute ?? (() => false),
                maxCount: item.maxCount ?? 0
            } as RequiredShopItem
        }
        else {
            return await this._readFromFile(item)
        }
    }

    static async get(id: number): Promise<Required<ShopItem> | null> {
        const item = this._items[id]
        if(!item) return null

        const validatedItem = await this._valid(item)
        if(!validatedItem) return null

        this._items[id] = validatedItem

        return this._items[id] as Required<ShopItem>
    }

    static async getWithLength(id: number): Promise<RequiredShopItemWithLength | null> {
        const item = await this.get(id)
        if(!item) return item

        return {...item, length: this.len(), index: id}
    }

    static len(): number {
        return this._items.length
    }

    static getCount(item: RequiredShopItem, count: number): number {
        const maxCount = item.maxCount <= 0 ? Number.MAX_SAFE_INTEGER : item.maxCount
        return Math.min(count, maxCount)
    }

    static getPriceByCount(item: RequiredShopItem, count: number): number {
        return this.getCount(item, count) * item.price
    }

    static getFormattedPriceByCount(item: RequiredShopItem, count: number): string {
        return StringUtils.toFormattedNumber(this.getPriceByCount(item, count))
    }

    static async execute(item: RequiredShopItem, options: ItemExecuteOptions): Promise<boolean> {
        if(item.cooldown > 0) {
            await sleep(item.cooldown)
        }

        return await item.execute(options)
    }
}