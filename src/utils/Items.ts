import UserNameService from '../classes/db/services/user/UserNameService'
import { DEFAULT_USER_NAME } from './consts'
import ContextUtils from './ContextUtils'
import MessageUtils from './MessageUtils'
import { AsyncOrSync, CallbackButtonContext } from './types'

type Item = {
    name: string,
    description: string,
    emoji: string,
    price: number,
    execute: (ctx: CallbackButtonContext) => AsyncOrSync
}

export default class Items {
    private static _items: Item[] = [
        {
            name: 'Повышение ранга',
            description: 'Да-да покупай, это не обман, уверяю тебя!',
            emoji: '🤥',
            price: 1000,
            execute: async ctx => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/mamont.pug',
                    {
                        changeValues: {
                            link: ContextUtils.getLinkUrl(ctx.from.id),
                            name: await UserNameService.get(ctx.from.id) ?? DEFAULT_USER_NAME
                        }
                    }
                )
            }
        },

        {
            name: 'Спасибо',
            description: 'Ты мне монету - я тебя спасибо!',
            emoji: '🤗',
            price: 1,
            execute: async ctx => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/items/thanks.pug',
                    {
                        changeValues: {
                            link: ContextUtils.getLinkUrl(ctx.from.id),
                            name: await UserNameService.get(ctx.from.id) ?? DEFAULT_USER_NAME
                        }
                    }
                )
            }
        }
    ]

    static get(id: number): Item | null {
        return this._items[id] ?? null
    }

    static getWithLength(id: number, length: number): Item & {length: number, index: number} | null {
        const item = this.get(id)
        if(!item) return item

        return {...item, length, index: id}
    }

    static len(): number {
        return this._items.length
    }
}