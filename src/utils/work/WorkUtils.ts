import { LEVEL_BOOST_MULTIPLIER } from "../../consts/number"
import InventoryItem from "../../db/entities/items/InventoryItem"
import { craftWorkUpItem, levelBoostItem, newGameItem, workBoostItem } from "../../resources/items/inventory"
import type { BotContext } from "../../types/bot"
import type { ClassTypes } from "../../types/class"
import ClassUtils from "../db/ClassUtils"
import type Item from "../items/Item"
import Logger from "../logs/Logger"
import RandomUtils from "../math/RandomUtils"

type MoneyBoostMultiplier = {
    item: Item
    multiplier: number
    onlyFirst?: boolean
}

export default class WorkUtils {
    static readonly moneyBoostMultipliers: MoneyBoostMultiplier[] = [
        {
            item: newGameItem,
            multiplier: 0.075,
            onlyFirst: false
        },
        {
            item: workBoostItem,
            multiplier: 0.25,
        },
        {
            item: craftWorkUpItem,
            multiplier: 0.15,
        }
    ]

    static readonly moneyAward = {
        min: 20,
        max: 75
    } as const

    static readonly experienceConsts = {
        currentLevelUp: 1,
        multiplier: 17,
        max: 625
    } as const

    static getQuest(ctx: BotContext, classType: ClassTypes = ClassUtils.defaultClassName): string {
        const isDefaultClassName = !ClassUtils.isPlayer(classType) || RandomUtils.halfChance()
        const type: ClassTypes = isDefaultClassName ? ClassUtils.defaultClassName : classType
        return ctx.t('work/quests', { type })
    }

    static getMoney(inventory: InventoryItem[]): number {
        const rawMoney = RandomUtils.range(
            this.moneyAward.min,
            this.moneyAward.max
        )

        const boost = InventoryItem.count(
            inventory,
            item => {
                const boost = this.moneyBoostMultipliers.find(
                    v => InventoryItem.equal(
                        v.item,
                        item
                    )
                )

                const onlyFirst = boost?.onlyFirst ?? true
                const count = Math.min(onlyFirst ? 1 : item.count, item.count)
                const multiplier = boost?.multiplier ?? 0

                return count * multiplier
            }
        ) + 1

        const result = Math.ceil(rawMoney * boost)
        
        Logger.debug(
            'WorkUtils.getMoney',
            {
                result,
                rawMoney,
                boost
            }
        )
        return result
    }

    static getExperience(level: number, inventory: InventoryItem[]): number {
        const rawExperience = RandomUtils.range(
            this.experienceConsts.multiplier,
            Math.min(
                this.experienceConsts.max,
                this.experienceConsts.multiplier * (level + this.experienceConsts.currentLevelUp)
            )
        )

        const boostCount = InventoryItem.countById(
            levelBoostItem,
            inventory
        )

        const boost = 1 + boostCount * LEVEL_BOOST_MULTIPLIER
        return Math.ceil(rawExperience * boost)
    }
}