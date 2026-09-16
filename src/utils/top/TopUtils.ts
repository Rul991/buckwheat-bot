import InventoryItem from "../../db/entities/items/InventoryItem"
import GameService from "../../db/services/game/GameService"
import InventoryItemService from "../../db/services/items/InventoryItemService"
import LevelService from "../../db/services/level/LevelService"
import MessagesService from "../../db/services/message/MessagesService"
import BalanceService from "../../db/services/money/BalanceService"
import RouletteService from "../../db/services/roulette/RouletteService"
import UserService from "../../db/services/user/UserService"
import { ranksSettings } from "../../resources/settings/ranks"
import type { ClassTypes } from "../../types/class"
import type { TopValues } from "../../types/top"
import ClassUtils from "../db/ClassUtils"
import RankUtils from "../db/RankUtils"
import ExperienceUtils from "../level/ExperienceUtils"
import Logger from "../logs/Logger"
import TopSubCommand from "./TopSubCommand"

export default class TopUtils {
    private static _subCommands: TopSubCommand[] = [
        new TopSubCommand({
            key: 'staff',
            type: 'role',
            hasTotalCount: false,
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                const users = await UserService.getAllByChatId(chatId)
                return users.map(user => {
                    return {
                        id: user.id,
                        value: user.rank
                    }
                })
            },
            handleSortedValuesCallback: async ({ ctx, values, chatId }) => {
                const rankVars = await Promise.all(
                    ranksSettings
                        .map(async value => {
                            const rank = value.id
                            return await RankUtils.getVars(ctx, chatId, rank)
                        })
                )

                Logger.debug(
                    'TopUtils.handleSortedValuesCallback | staff',
                    rankVars
                )

                return values
                    .filter(v => +v.value > 0)
                    .map(v => {
                        const rank = +v.value
                        const { emoji, name } = rankVars.find(v => v.value == rank)!
                        return {
                            id: v.id,
                            value: ctx.t(
                                'rank/top-value',
                                {
                                    emoji,
                                    name,
                                    rank
                                }
                            )
                        }
                    })
            }
        }),

        new TopSubCommand({
            key: 'money',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                const balances = await BalanceService.getAllByChatIdType(
                    chatId,
                )

                return balances
                    .filter(v => v.total != 0)
                    .map(v => {
                        return {
                            value: v.total,
                            id: v.id
                        }
                    })
            }
        }),

        new TopSubCommand({
            key: 'level',
            hasTotalCount: false,
            hasWinner: true,
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                const levels = await LevelService.getAllByChatId(chatId)
                return levels
                    .filter(v => v.currentExperience > 0)
                    .map(v => {
                        return {
                            id: v.id,
                            value: ExperienceUtils.getLevelFromObject(v)
                        }
                    })
            }
        }),

        new TopSubCommand({
            key: 'classes',
            hasTotalCount: false,
            type: 'role',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                const users = await UserService.getAllByChatId(chatId)
                return users
                    .filter(v => v.className != ClassUtils.defaultClassName)
                    .map(user => {
                        return {
                            value: user.className,
                            id: user.id
                        }
                    })
            },
            handleSortedValuesCallback: async ({ ctx, values }) => {
                return values.map(v => {
                    const classType = v.value as ClassTypes
                    return {
                        value: ctx.t('classes/full-name', { type: classType }),
                        id: v.id
                    }
                })
            }
        }),

        new TopSubCommand({
            key: 'messages/day',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                return await MessagesService.getUnsortedTopValues(chatId, 'day')
            }
        }),

        new TopSubCommand({
            key: 'messages/month',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                return await MessagesService.getUnsortedTopValues(chatId, 'month')
            }
        }),

        new TopSubCommand({
            key: 'messages/year',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                return await MessagesService.getUnsortedTopValues(chatId, 'year')
            }
        }),

        new TopSubCommand({
            key: 'messages/total',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                return await MessagesService.getUnsortedTopValues(chatId, 'total')
            }
        }),

        new TopSubCommand({
            key: 'roulette',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                const roulettes = await RouletteService.getAllByChatId(chatId)
                return roulettes
                    .map(v => {
                        return {
                            id: v.id,
                            value: v.maxWinStreak
                        }
                    })
            }
        }),

        new TopSubCommand({
            key: 'games/cube',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                return await GameService.getUnsortedTopValues(chatId, 'cube')
            }
        }),

        new TopSubCommand({
            key: 'games/casino',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                return await GameService.getUnsortedTopValues(chatId, 'casino')
            }
        }),

        new TopSubCommand({
            key: 'games/duel',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                return await GameService.getUnsortedTopValues(chatId, 'duel')
            }
        }),

        new TopSubCommand({
            key: 'inventory',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                const inventories = await InventoryItemService.getInventoriesByChatId(chatId)
                const result: TopValues[] = []

                for (const [id, inventory] of inventories) {
                    result.push({
                        id,
                        value: InventoryItem.count(inventory)
                    })
                }

                return result
            }
        }),

        new TopSubCommand({
            key: 'net-worth',
            getUnsortedValuesCallback: async (_ctx, chatId) => {
                const balances = await BalanceService.getAllByChatIdType(chatId, 'user')
                const inventories = await InventoryItemService.getInventoriesByChatId(chatId)

                return balances
                    .map(v => {
                        const id = v.id
                        const inventory = inventories.getOrInsert(id, [])
                        return {
                            id,
                            value: InventoryItem.getInventoryPrice(inventory) + v.total
                        }
                    })
            }
        }),
    ]

    static keys = Object.keys(this._subCommands).map(v => +v)

    static getSubCommand(id: number) {
        return this._subCommands[id] ?? this._subCommands[0]!
    }
}