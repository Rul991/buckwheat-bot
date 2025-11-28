import CasinoGetAllService from '../classes/db/services/casino/CasinoGetAllService'
import CubeWinsService from '../classes/db/services/cube/CubeWinsService'
import ExperienceService from '../classes/db/services/level/ExperienceService'
import LevelService from '../classes/db/services/level/LevelService'
import MessagesService from '../classes/db/services/messages/MessagesService'
import RouletteService from '../classes/db/services/roulette/RouletteService'
import UserProfileService from '../classes/db/services/user/UserProfileService'
import UserRankService from '../classes/db/services/user/UserRankService'
import ClassUtils from './ClassUtils'
import LevelUtils from './level/LevelUtils'
import RankUtils from './RankUtils'

type GetUnsortedValuesResult = {
    id: number
    value: number | string
}

type SubCommand = {
    title: string
    emoji: string
    changeValues: {
        property: string
    } | {
        rawTitle: string
    }
    getUnsortedValues: (chatId: number) => Promise<GetUnsortedValuesResult[]>
    handleSortedValues?: (values: GetUnsortedValuesResult[]) => Promise<GetUnsortedValuesResult[]>
}

type TitleAndKey = {
    title: string
    key: string
}

export default class {
    private static _subCommands: Record<string, SubCommand> = {
        staff: {
            title: 'Иерархия',
            emoji: '👑',
            changeValues: {
                rawTitle: 'Иерархия чата'
            },
            getUnsortedValues: async chatId => {
                return (await UserRankService.getAllWithId(chatId))
                    .filter(({rank}) => rank > RankUtils.min)
                    .map(({id, rank}) => {
                        return {
                            id,
                            value: rank
                        }
                    })
            },
            handleSortedValues: async values => {
                return values.map(({id, value}) => {
                    const rank = value as number
                    const rankName = RankUtils.getRankByNumber(rank)
                    const rankEmoji = RankUtils.getEmojiByRank(rank)
                    return {
                        id,
                        value: `${rankName} ${rankEmoji}`
                    }
                })
            }
        },

        money: {
            title: 'Богатство',
            emoji: '💰',
            changeValues: {
                property: 'богатых'
            },
            getUnsortedValues: async (chatId) => {
                return (await CasinoGetAllService.money(chatId))
                    .filter(({value}) => value != 0)
            }
        },

        level: {
            title: 'Уровень',
            emoji: '📈',
            changeValues: {
                property: 'прокаченных'
            },
            getUnsortedValues: async chatId => {
                return (await ExperienceService.getAllWithId(chatId))
                    .filter(({experience}) => experience && experience > 0)
                    .map(({id, experience}) => {
                        return {
                            id,
                            value: experience
                        }
                    })
            },
            handleSortedValues: async values => {
                return values.map(({id, value}) => {
                    return {
                        id,
                        value: LevelUtils.get(value as number)
                    }
                })
            }
        },

        classes: {
            title: 'Классы',
            emoji: '👾',
            changeValues: {
                rawTitle: 'Классы игроков'
            },
            getUnsortedValues: async chatId => {
                const users = await UserProfileService.getAll(chatId)

                return users
                    .filter(({className}) => className && className != ClassUtils.defaultClassName)
                    .map(({id, className}) => {
                        return {
                            id,
                            value: ClassUtils.getName(className ?? ClassUtils.defaultClassName)
                        }
                    })
            }
        },

        chat: {
            title: 'Сообщения',
            emoji: '💬',
            changeValues: {
                property: 'общительных'
            },
            getUnsortedValues: async chatId => {
                return (await MessagesService.getAll(chatId))
                    .filter(({total}) => total && total > 0)
                    .map(({id, total}) => {
                        return {
                            id,
                            value: total ?? 0
                        }
                    })
            }
        },

        roulette: {
            title: 'Рулетка',
            emoji: '🔫',
            changeValues: {
                property: 'везучих'
            },
            getUnsortedValues: async chatId => {
                return (await RouletteService.getAll(chatId))
                    .filter(({winStreak}) => winStreak && winStreak > 0)
                    .map(({id, winStreak}) => {
                        return {
                            id,
                            value: winStreak ?? 0
                        }
                    })
            }
        },

        cubeWin: {
            title: 'Побед в кубах',
            emoji: '🎲',
            changeValues: {
                property: 'азартных'
            },
            getUnsortedValues: async chatId => {
                return (await CubeWinsService.getAllWithId(chatId))
                    .filter((
                        {value}) => value !== undefined && value > 0
                    ) as GetUnsortedValuesResult[]
            }
        }
    }

    static getTitleAndKeys(): TitleAndKey[] {
        return Object.entries(this._subCommands)
            .map<TitleAndKey>(([key, { title, emoji }]) => {
                return {
                    key,
                    title: `${emoji} ${title}`
                }
            })
    }

    static getSubCommand(name: string) {
        return this._subCommands[name] ?? this._subCommands['staff']
    }
}