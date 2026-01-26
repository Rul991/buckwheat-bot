import CardsService from '../classes/db/services/card/CardsService'
import CasinoGetAllService from '../classes/db/services/casino/CasinoGetAllService'
import CubeWinsService from '../classes/db/services/cube/CubeWinsService'
import ExperienceService from '../classes/db/services/level/ExperienceService'
import MessagesService from '../classes/db/services/messages/MessagesService'
import RouletteService from '../classes/db/services/roulette/RouletteService'
import ChatSettingsService from '../classes/db/services/settings/ChatSettingsService'
import RankSettingsService from '../classes/db/services/settings/RankSettingsService'
import UserProfileService from '../classes/db/services/user/UserProfileService'
import UserRankService from '../classes/db/services/user/UserRankService'
import ClassUtils from './ClassUtils'
import LevelUtils from './level/LevelUtils'
import RankUtils from './RankUtils'
import SettingUtils from './settings/SettingUtils'

type GetUnsortedValuesResult = {
    id: number
    value: number | string
}

type HandleSortedValuesOptions = {
    values: GetUnsortedValuesResult[]
    chatId: number
}

type SubCommand = {
    title: string
    emoji: string
    name?: string
    topOrRole?: boolean
    hasTotalCount?: boolean
    hasWinner?: boolean
    changeValues: {
        property: string
    } | {
        rawTitle: string
    }
    getUnsortedValues: (chatId: number) => Promise<GetUnsortedValuesResult[]>
    handleSortedValues?: (values: HandleSortedValuesOptions) => Promise<GetUnsortedValuesResult[]>
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
            hasTotalCount: false,
            topOrRole: false,
            changeValues: {
                rawTitle: 'Иерархия чата'
            },
            getUnsortedValues: async chatId => {
                return (await UserRankService.getAllWithId(chatId))
                    .filter(({ rank }) => rank > RankUtils.min)
                    .map(({ id, rank }) => {
                        return {
                            id,
                            value: rank
                        }
                    })
            },
            handleSortedValues: async ({ values, chatId }) => {
                const settings = await RankSettingsService.getObject(chatId)
                const isShowRank = await ChatSettingsService.get<'boolean'>(chatId, 'showRankInTop')

                return values.map(({ id, value }) => {
                    const rank = value as number
                    const settingName = `rank-${rank}`

                    const rankName = settings[settingName] || SettingUtils.dummyDefault
                    const rankEmoji = RankUtils.getEmojiByRank(rank)
                    const rankNumber = isShowRank ? `[${rank}]` : ''
                    
                    return {
                        id,
                        value: `${rankEmoji} ${rankName} ${rankNumber}`
                    }
                })
            }
        },

        money: {
            title: 'Богатство',
            emoji: '💰',
            name: 'монет',
            changeValues: {
                property: 'богатых'
            },
            getUnsortedValues: async (chatId) => {
                return (await CasinoGetAllService.money(chatId))
                    .filter(({ value }) => value != 0)
            }
        },

        level: {
            title: 'Уровень',
            emoji: '📈',
            name: 'уровней',
            hasTotalCount: false,
            hasWinner: true,
            changeValues: {
                property: 'прокачанных'
            },
            getUnsortedValues: async chatId => {
                return (await ExperienceService.getAllWithId(chatId))
                    .filter(({ experience }) => experience && experience > 0)
                    .map(({ id, experience }) => {
                        return {
                            id,
                            value: experience
                        }
                    })
            },
            handleSortedValues: async ({ values }) => {
                return values.map(({ id, value }) => {
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
            hasTotalCount: false,
            topOrRole: false,
            changeValues: {
                rawTitle: 'Классы игроков'
            },
            getUnsortedValues: async chatId => {
                const users = await UserProfileService.getAll(chatId)

                return users
                    .filter(
                        ({ className }) =>
                            className && className != ClassUtils.defaultClassName
                    )
                    .map(({ id, className: rawClass }) => {
                        const classType = rawClass ?? ClassUtils.defaultClassName
                        const emoji = ClassUtils.getEmoji(classType)
                        const name = ClassUtils.getName(classType)
                        return {
                            id,
                            value: `${emoji} ${name}`
                        }
                    })
            }
        },

        chat: {
            title: 'Сообщения',
            emoji: '💬',
            name: 'сообщений',
            changeValues: {
                property: 'общительных'
            },
            getUnsortedValues: async chatId => {
                return (await MessagesService.getAll(chatId))
                    .filter(({ total }) => total && total > 0)
                    .map(({ id, total }) => {
                        return {
                            id,
                            value: total ?? 0
                        }
                    })
            }
        },

        roulette: {
            title: 'Рулетка',
            name: 'побед',
            emoji: '🔫',
            changeValues: {
                property: 'везучих'
            },
            getUnsortedValues: async chatId => {
                return (await RouletteService.getAll(chatId))
                    .filter(({ maxWinStreak: winStreak }) =>
                        winStreak && winStreak > 0)
                    .map(({ id, maxWinStreak: winStreak }) => {
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
            name: 'побед',
            changeValues: {
                property: 'азартных'
            },
            getUnsortedValues: async chatId => {
                return (await CubeWinsService.getAllWithId(chatId))
                    .filter((
                        { value }) => value !== undefined && value > 0
                    ) as GetUnsortedValuesResult[]
            }
        },

        cards: {
            title: 'Карточки',
            emoji: '🃏',
            changeValues: {
                rawTitle: 'Топ коллекционеров'
            },
            getUnsortedValues: async chatId => {
                return (await CardsService.getAllCardsWithId(chatId))
                    .filter(({ cards }) => cards > 0)
                    .map(({ id, cards: value }) => ({ id, value }))
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