import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import UserNameService from '../classes/db/services/user/UserNameService'
import AdminUtils from './AdminUtils'
import { CASINO_PLUS_BOOST, DEFAULT_USER_NAME, MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from './consts'
import ContextUtils from './ContextUtils'
import MessageUtils from './MessageUtils'
import { AsyncOrSync, CallbackButtonContext } from './types'

type ShopItem = {
    name: string,
    description: string,
    emoji: string,
    price: number,
    execute: (ctx: CallbackButtonContext, user: {link: string, name: string}) => AsyncOrSync<boolean>
}

export default class ShopItems {
    private static _items: ShopItem[] = [
        {
            name: 'Повышение ранга',
            description: 'Да-да покупай, это не обман, уверяю тебя!',
            emoji: '🤥',
            price: 1000,
            execute: async (ctx, user) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/mamont.pug',
                    {
                        changeValues: user
                    }
                )

                return true
            }
        },

        {
            name: 'Спасибо',
            description: 'Ты мне монету - я тебя спасибо!',
            emoji: '🤗',
            price: 1,
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
            name: 'Бесплатный кик',
            description: 'Продаю бесплатный кик на 1м',
            emoji: '❗️',
            price: 0,
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
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/kick/cant-kicked.pug',
                        {
                            changeValues: user
                        }
                    )
                }

                return true
            }
        },

        {
            name: 'Улучшение на казино',
            description: 'Даю тебе больше денег за победу',
            emoji: '🎰',
            price: 2000,
            execute: async (ctx, user) => {
                const isUpdated = await InventoryItemService.add(ctx.from.id, 'manyCasino')

                if(isUpdated)
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/casino/many.pug',
                        {
                            changeValues: {
                                ...user,
                                money: CASINO_PLUS_BOOST
                            }
                        }
                    )

                return isUpdated
            }
        },

        {
            name: 'Беспроигрышное казино',
            description: 'Перестаю забирать деньги за казино',
            emoji: '🎰',
            price: 15000,
            execute: async (ctx, user) => {
                const isUpdated = await InventoryItemService.add(ctx.from.id, 'infinityCasino')

                if(isUpdated)
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/casino/infinity.pug',
                        {
                            changeValues: user
                        }
                    )

                return isUpdated
            }
        },
    ]

    static get(id: number): ShopItem | null {
        return this._items[id] ?? null
    }

    static getWithLength(id: number, length: number): ShopItem & {length: number, index: number} | null {
        const item = this.get(id)
        if(!item) return item

        return {...item, length, index: id}
    }

    static len(): number {
        return this._items.length
    }
}