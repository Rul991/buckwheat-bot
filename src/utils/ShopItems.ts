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
            price: 999,
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

        {
            name: 'Шкатулка жадности',
            description: 'Дает деньги, стоит дорого, ничего не берет взамен',
            emoji: '🪙',
            price: 150000,
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

                const isUpdated = await InventoryItemService.add(ctx.from.id, 'greedBox')

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
            name: 'Платный размут',
            description: 
            `Вы находитесь в муте? Считаете, что права говорить это то, что положено вам по конституции?
            
Покупайте данный размут и вы сможете говорить вопреки всему!`,
            emoji: '🙊',
            price: 1000,
            execute: async (ctx, user) => {
                const unMuted = await AdminUtils.unmute(ctx, ctx.from.id)

                if(unMuted) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/default.pug',
                        {
                            changeValues: user
                        }
                    )
                }
                
                return unMuted
            },
        },

        {
            name: 'Печенье',
            description: 'Вкусные печеньки',
            emoji: '🍪',
            price: 10,
            execute: async (ctx, user) => {
                await InventoryItemService.add(ctx.from.id, 'cookie')

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/cookie.pug',
                    {
                        changeValues: user
                    }
                )

                return true
            }
        },

        {
            name: 'Повышение',
            description: 'Увеличивает доход с квестов',
            emoji: '🪙',
            price: 400,
            execute: async (ctx, user) => {
                const isAdded = await InventoryItemService.add(ctx.from.id, 'workUp')

                if(isAdded) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/work/workUp.pug',
                        {
                            changeValues: user
                        }
                    )
                }

                return isAdded
            }
        },

        {
            name: 'Каталог с квестами',
            description: 'Больше квестов - меньше ожидание!',
            emoji: '🪙',
            price: 800,
            execute: async (ctx, user) => {
                const isAdded = await InventoryItemService.add(ctx.from.id, 'workCatalog')

                if(isAdded) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/items/work/workCatalog.pug',
                        {
                            changeValues: user
                        }
                    )
                }

                return isAdded
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