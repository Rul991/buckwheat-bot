import Casino from '../../../../interfaces/schemas/Casino'
import Messages from '../../../../interfaces/schemas/Messages'
import User from '../../../../interfaces/schemas/User'
import ArrayUtils from '../../../../utils/ArrayUtils'
import ClassUtils from '../../../../utils/ClassUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import SubCommandUtils from '../../../../utils/SubCommandUtils'
import { TextContext, MaybeString, AsyncOrSync, NameObject, ClassTypes } from '../../../../utils/types'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import MessagesService from '../../../db/services/messages/MessagesService'
import UserProfileService from '../../../db/services/user/UserProfileService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

type SubTopCommand = {
    filename: string,
    execute: (ctx: TextContext, data: string) => AsyncOrSync<Record<string, any>>
} & NameObject

type TopMessageLocals<T> = {
    title: string,
    users: User[],
    sorted: T[],
    key: keyof T,
    useId?: boolean
}

export default class MoneyTopCommand extends BuckwheatCommand {
    private _subCommands: SubTopCommand[] = [
        {
            name: 'стафф',
            filename: 'staff',
            execute: async (ctx) => {
                type Player = string
                type Rating = {emoji: string, rankName: string, players: Player[]}

                let ratings: Rating[] = []

                for (let rank = RankUtils.maxRank; rank >= 0; rank--) {
                    const users = await UserRankService.findByRank(rank)
                    if(!users.length) continue

                    const players: Player[] = []

                    for await (const {name} of users) {
                        players.push(name)
                    }

                    ratings.push({
                        emoji: RankUtils.getEmojiByRank(rank),
                        rankName: RankUtils.getRanksByNumber(rank),
                        players
                    })
                }
                const members = ratings.reduce(
                    (prev, curr) => prev + curr.players.length,
                    0
                )

                return {
                    ratings,
                    members,
                    maxMembers: await ctx
                        .telegram
                        .getChatMembersCount(ctx.chat.id)
                }
            }
        },

        {
            name: 'богачи',
            filename: 'top',
            execute: async () => {
                return {
                    sorted: await CasinoGetService.getSortedCasinos(),
                    users: await UserProfileService.getAll(),
                    title: 'богатых',
                    key: 'money'
                } as TopMessageLocals<Casino>
            }
        },

        {
            name: 'чат',
            filename: 'top',
            execute: async () => {
                const messages = await MessagesService.getAll()

                return {
                    sorted: ArrayUtils.filterAndSort(messages, 'total', 10),
                    users: await UserProfileService.getAll(),
                    title: 'общительных',
                    key: 'total'
                } as TopMessageLocals<Messages>
            }
        },

        {
            name: 'классы',
            filename: 'class',
            execute: async () => {
                const classMembers: Record<ClassTypes, string[]> = {
                    knight: [],
                    thief: [],
                    sorcerer: [],
                    engineer: [],
                    bard: [],
                    unknown: []
                }

                const users = await UserProfileService.getAll()

                for (const {className, name} of users) {
                    if(!className) continue

                    classMembers[className].push(name)
                }

                return {
                    classMembers,
                    emojies: Object.entries(classMembers).reduce(
                        (prev, [key]) => {
                            return {...prev, [key]: ClassUtils.getEmoji(key as ClassTypes)}
                        },
                        {}
                    ),
                    classTitles: {
                        knight: 'Рыцари',
                        thief: 'Воры',
                        sorcerer: 'Маги',
                        engineer: 'Инженеры',
                        bard: 'Барды',
                        unknown: 'Не выбрали'
                    }
                }
            }
        }
    ]

    constructor() {
        super()
        this._name = 'топ'
        this._description = 'показываю список от богатых к бедным'
        this._needData = true

        const commands = SubCommandUtils.getArgumentText(this._subCommands)
        this._argumentText = `(${commands})`
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const [command, data] = SubCommandUtils.getSubCommandAndData(
            other,
            this._subCommands
        )

        const {filename: path, execute} = typeof command == 'string' ? this._subCommands[0] : command

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/top/${path}.pug`,
            {
                changeValues: await execute(ctx, data.toString())
            }
        )
    }
}