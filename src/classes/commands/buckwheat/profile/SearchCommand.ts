import User from '../../../../interfaces/schemas/user/User'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { Link } from '../../../../utils/values/types/types'
import UserProfileService from '../../../db/services/user/UserProfileService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

type SearchObject = {
    prefix: string
    execute: (options: BuckwheatCommandOptions & { data: string }) => Promise<User[]>
    text: string
}

export default class extends BuckwheatCommand {
    protected _settingId: string = 'search'
    private readonly _prefixSeparator = ':'

    private _noPrefixSearchObject: SearchObject = {
        execute: async options => {
            const {
                chatId,
                data
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

    private _searchObjects: SearchObject[] = [
        {
            prefix: 'r',
            execute: async options => {
                const {
                    chatId,
                    data
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
                    data
                } = options

                const id = StringUtils.getNumberFromString(data)
                const user = await UserProfileService.get(chatId, id)

                return user ? [user] : []
            },
            text: 'айди:'
        }
    ]

    constructor () {
        super()
        this._name = 'поиск'
        this._aliases = [
            'найти'
        ]
        this._description = 'нахожу игроков по заданным параметрам в чате'
        this._minimumRank = 1
    }

    private async _getUsers(options: BuckwheatCommandOptions) {
        const {
            other = ''
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
                    data
                }),
                obj,
                data,
            }
        }

        return {
            data: other,
            users: await this._noPrefixSearchObject.execute({
                ...options,
                data: other
            }),
            obj: this._noPrefixSearchObject
        }
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            other
        } = options

        if (!other) {
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
        else {
            const {
                users,
                obj: search,
                data
            } = await this._getUsers(
                options
            )

            const links: Link[] = users
                .slice(0, 20)
                .map(
                    ({ id, name }) => {
                        return {
                            link: ContextUtils.getLinkUrl(id),
                            name
                        }
                    }
                )

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/search/done.pug',
                {
                    changeValues: {
                        users: links,
                        search,
                        data,
                        otherUsers: Math.max(0, users.length - 20)
                    }
                }
            )
        }
    }
}