import { CallbackButtonOptions } from './values/types/action-options'
import { NewScrollerData } from './values/types/scrollers'
import UserProfileService from '../classes/db/services/user/UserProfileService'
import User from '../interfaces/schemas/user/User'
import UserRankService from '../classes/db/services/user/UserRankService'
import StringUtils from './StringUtils'
import { Context } from 'telegraf'
import MessageUtils from './MessageUtils'

type Options = CallbackButtonOptions<NewScrollerData<{ other: string }>>

type SearchObject = {
    prefix: string
    execute: (options: Options & { text: string }) => Promise<User[]>
    text: string
}

export default class {
    private static readonly _prefixSeparator = ':'

    private static _noPrefixSearchObject: SearchObject = {
        execute: async options => {
            const {
                chatId,
                text: data
            } = options

            const lowerData = data.toLowerCase()
            const users = await UserProfileService.getAll(chatId)

            return users.filter(({ name }) => {
                const lowerName = name.toLowerCase()
                return lowerName.includes(lowerData)
            })
        },
        text: 'именем, которое содержит:',
        prefix: ''
    }

    private static _searchObjects: SearchObject[] = [
        {
            prefix: 'r',
            execute: async options => {
                const {
                    chatId,
                    text: data
                } = options

                const rank = StringUtils.getNumberFromString(data)
                return await UserRankService.getAllWithMinRank(chatId, rank)
            },
            text: 'рангом >='
        },

        {
            prefix: 'id',
            execute: async options => {
                const {
                    chatId,
                    text: data
                } = options

                const id = StringUtils.getNumberFromString(data)
                const user = await UserProfileService.get(chatId, id)

                return user ? [user] : []
            },
            text: 'айди:'
        }
    ]

    static async getUsers(options: Options) {
        const {
            data: {
                other
            }
        } = options

        for (const obj of this._searchObjects) {
            const {
                prefix
            } = obj

            const fullPrefix = `${prefix}${this._prefixSeparator}`
            const hasPrefix = other.startsWith(fullPrefix)
            if (!hasPrefix) continue

            const data = other.substring(fullPrefix.length)

            return {
                users: await obj.execute({
                    ...options,
                    text: data
                }),
                obj,
                data,
            }
        }

        return {
            data: other,
            users: await this._noPrefixSearchObject.execute({
                ...options,
                text: other
            }),
            obj: this._noPrefixSearchObject
        }
    }

    static async sendHelpMessage(ctx: Context) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/search/no-text.pug',
            {
                changeValues: {
                    sep: this._prefixSeparator,
                    subCommands: [
                        this._noPrefixSearchObject,
                        ...this._searchObjects
                    ]
                }
            }
        )
    }
}