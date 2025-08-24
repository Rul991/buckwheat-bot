import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import UserRankService from '../classes/db/services/user/UserRankService'
import AdminUtils from './AdminUtils'
import { LEVEL_BOOST, MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from './values/consts'
import MessageUtils from './MessageUtils'
import RankUtils from './RankUtils'
import { AsyncOrSync, CallbackButtonContext } from './values/types'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'

type ItemExecuteCallback = (
    ctx: CallbackButtonContext, 
    user: {link: string, name: string},
    item: RequiredShopItem
) => AsyncOrSync<boolean>

type ShopItem = 
    {
        filename?: string | undefined,
        name?: string,
        description?: string,
        emoji?: string,
        price?: number,
        execute: ItemExecuteCallback
    }

type RequiredShopItem = Required<ShopItem>

export default class ShopItems {
    private static _items: ShopItem[] = [
        {
            filename: "rankUp",
            execute: async (ctx, user) => {
                const rank = await UserRankService.get(ctx.from.id)
                if(rank >= RankUtils.moderator) return false

                const [isBought] = await InventoryItemService.add(ctx.from.id, 'rankUp')
                await UserRankService.update(ctx.from.id, rank + 1)

                if(isBought) 
                    await ContextUtils.showCallbackMessageFromFile(
                        ctx,
                        'text/commands/items/default.pug'
                    )

                return isBought
            }
        },

        {
            filename: "thanks",
            execute: async (ctx, user) => {
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
            execute: async (ctx, user) => {
                const isKicked = await AdminUtils.ban(
                    ctx, 
                    ctx.from.id, 
                    MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE
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
            execute: async (ctx, user) => {
                const [isUpdated] = await InventoryItemService.add(ctx.from.id, 'manyCasino')

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
            execute: async (ctx, user) => {
                const [isUpdated] = await InventoryItemService.add(ctx.from.id, 'infinityCasino')

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
            execute: async (ctx, user) => {
                if(await InventoryItemService.anyHas('greedBox')) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/greedBox/empty.pug',
                        {
                            changeValues: user
                        }
                    )
                    return false
                }

                const [isUpdated] = await InventoryItemService.add(ctx.from.id, 'greedBox')

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
            execute: async (ctx, user) => {
                const unMuted = await AdminUtils.unmute(ctx, ctx.from.id)

                if(unMuted) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/default-user.pug',
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
            execute: async (ctx, _) => {
                const [_isBought, count] = await InventoryItemService.add(ctx.from.id, 'cookie')

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
            execute: async (ctx, user) => {
                const [isAdded] = await InventoryItemService.add(ctx.from.id, 'workUp')

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
            execute: async (ctx, user) => {
                const [isAdded] = await InventoryItemService.add(ctx.from.id, 'workCatalog')

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
            name: 'Ускоритель уровня',
            description: `Позволяет увеличить получаемый опыт на ${LEVEL_BOOST}%`,
            emoji: '📈',
            price: 1000,
            execute: async (ctx, _user, item) => {
                const [_, count] = await InventoryItemService.add(ctx.from.id, 'levelBoost')

                await ContextUtils.showCallbackMessage(
                    ctx,
                    await FileUtils.readPugFromResource(
                        'text/commands/items/default.pug',
                        {
                            changeValues: {
                                count,
                                name: item.name
                            }
                        }
                    )
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
            typeof item.name == 'string' && 
            typeof item.description == 'string' &&
            typeof item.emoji == 'string' && 
            typeof item.price == 'number'
        )
    }

    private static async _readFromFile(item: ShopItem): Promise<RequiredShopItem | null> {
        if(!this._hasFileName(item)) return null

        const jsonItem = await FileUtils.readJsonFromResource<RequiredShopItem>(
            `json/shop_items/${item.filename}.json`
        )

        if(jsonItem && this._isValid(jsonItem)) return {...jsonItem, ...item}
        else return null
    }

    private static async _valid(item: ShopItem): Promise<RequiredShopItem | null> {
        if(this._isValid(item)) {
            return item as RequiredShopItem
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
        return validatedItem
    }

    static async getWithLength(id: number): Promise<(RequiredShopItem & { length: number; index: number }) | null> {
        const item = await this.get(id)
        if(!item) return item

        return {...item, length: this.len(), index: id}
    }

    static len(): number {
        return this._items.length
    }
}