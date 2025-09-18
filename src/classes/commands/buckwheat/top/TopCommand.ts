import User from '../../../../interfaces/schemas/User'
import ArrayUtils from '../../../../utils/ArrayUtils'
import ClassUtils from '../../../../utils/ClassUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import StringUtils from '../../../../utils/StringUtils'
import SubCommandUtils from '../../../../utils/SubCommandUtils'
import { TextContext, MaybeString, AsyncOrSync, NameObject, ClassTypes, TopLevelObject } from '../../../../utils/values/types'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import LevelService from '../../../db/services/level/LevelService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MessagesService from '../../../db/services/messages/MessagesService'
import UserLeftService from '../../../db/services/user/UserLeftService'
import UserProfileService from '../../../db/services/user/UserProfileService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

type SubTopCommand = {
    filename: string,
    getChangeValues: (ctx: TextContext, data: string) => AsyncOrSync<Record<string, any> & {id: number}>
} & NameObject

type TopMessageLocals<T> = {
    title: string,
    users: User[],
    sorted: T[],
    key: keyof T,
    id: number,
    unit: string
    totalCount: string
}

const createTopChangeValues = async <Input, Output = Input>(
    arr: Input[], 
    callback: (arr: Input[]) => Output[],
    options: {key: keyof Output, id?: number, title: string, unit?: string, chatId: number}
): Promise<TopMessageLocals<Output>> => {
    const sorted = callback(arr)

    return {
        title: options.title,
        users: await UserProfileService.getAll(options.chatId),
        sorted,
        key: options.key,
        id: options.id ?? 0,
        unit: options.unit ?? '',
        totalCount: ''
    } as TopMessageLocals<Output>
}

const formatAllNumbersInObjects = <
    T extends Record<string, any> & {id: number}, 
    Key extends keyof T
>(arr: T[], key: Key) => {
    return arr.map(obj => (
        {
            id: obj.id, 
            [key]: StringUtils.toFormattedNumber(obj[key] ?? 0)
        }
    ))
}

export default class TopCommand extends BuckwheatCommand {
    private _subCommands: SubTopCommand[] = [
        {
            name: 'иерархия',
            filename: 'staff',
            getChangeValues: async ctx => {
                type Player = {name: string, isLeft: boolean}
                type Rating = {emoji: string, rankName: string, players: Player[]}

                let ratings: Rating[] = []
                const chatId = await LinkedChatService.getCurrent(ctx)
                if(!chatId) return {id: ctx.botInfo.id}

                for (let rank = RankUtils.max; rank >= 1; rank--) {
                    const users = await UserRankService.findByRank(chatId, rank)
                    if(!users.length) continue

                    const players: Player[] = []

                    for await (const {id, name} of users) {
                        players.push({
                            name, 
                            isLeft: await UserLeftService.get(chatId, id) ?? false
                        })
                    }

                    ratings.push({
                        emoji: RankUtils.getEmojiByRank(rank),
                        rankName: RankUtils.getRanksByNumber(rank),
                        players
                    })
                }

                return {
                    ratings,
                    id: ctx.botInfo.id
                }
            }
        },

        {
            name: 'богачи',
            filename: 'top',
            getChangeValues: async ctx => {
                const key = 'money'
                const chatId = await LinkedChatService.getCurrent(ctx)
                if(!chatId) return {id: ctx.botInfo.id}

                return createTopChangeValues(
                    await CasinoGetService.sortedCasinos(chatId),
                    arr => formatAllNumbersInObjects(arr, key),
                    {
                        key,
                        id: ctx.botInfo.id,
                        title: 'богатых',
                        unit: '💰',
                        chatId
                    }
                )
            }
        },

        {
            name: 'чат',
            filename: 'top',
            getChangeValues: async ctx => {
                const key = 'total'
                const chatId = await LinkedChatService.getCurrent(ctx)
                if(!chatId) return {id: ctx.botInfo.id}

                return createTopChangeValues(
                    ArrayUtils.filterAndSort(await MessagesService.getAll(chatId), key, 10),
                    arr => formatAllNumbersInObjects(arr, key),
                    {
                        key,
                        id: ctx.botInfo.id,
                        title: 'общительных',
                        unit: '✉️',
                        chatId
                    }
                )
            }
        },

        {
            name: 'классы',
            filename: 'class',
            getChangeValues: async ctx => {
                const chatId = await LinkedChatService.getCurrent(ctx)
                if(!chatId) return {id: ctx.botInfo.id}

                const classMembers: Record<ClassTypes, string[]> = ClassUtils.getArray()
                const users = await UserProfileService.getAll(chatId)

                for (const {className, name} of users) {
                    if(!className) continue

                    if(!classMembers[className]) classMembers[className] = []
                    classMembers[className].push(name)
                }

                return {
                    classMembers,
                    id: ctx.botInfo.id,
                    emojies: Object.entries(classMembers).reduce(
                        (prev, [key]) => {
                            return {...prev, [key]: ClassUtils.getEmoji(key as ClassTypes)}
                        },
                        {}
                    ),
                    classTitles: ClassUtils.getNames()
                }
            }
        },

        {
            name: 'уровни',
            filename: 'top',
            getChangeValues: async ctx => {
                const key = 'level'
                const chatId = await LinkedChatService.getCurrent(ctx)
                if(!chatId) return {id: ctx.botInfo.id}

                return createTopChangeValues(
                    await LevelService.getAllSorted(chatId),
                    arr => arr,
                    {
                        key,
                        id: ctx.botInfo.id,
                        title: 'прокаченных',
                        unit: '📈',
                        chatId
                    }
                )
            }
        },
    ]

    constructor() {
        super()
        this._name = 'топ'
        this._description = 'показываю топ игроков по разным параметрам'
        this._needData = true

        const commands = SubCommandUtils.getArgumentText(this._subCommands)
        this._argumentText = `(${commands})`
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const [command, data] = SubCommandUtils.getSubCommandAndData(
            other,
            this._subCommands
        )

        const {filename: path, getChangeValues: execute} = typeof command == 'string' ? this._subCommands[0] : command

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/top/${path}.pug`,
            {
                changeValues: await execute(ctx, data?.toString() ?? '')
            }
        )
    }
}