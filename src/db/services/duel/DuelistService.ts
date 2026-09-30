import { DEAD_HEALTH, MIN_SHIELD } from "../../../consts/number"
import { characters } from "../../../resources/duels/characters/characters"
import type { BotContext } from "../../../types/bot"
import type { ClassTypes } from "../../../types/class"
import type { CanSaveDuelistResult } from "../../../types/duels"
import ClassUtils from "../../../utils/db/ClassUtils"
import DuelistUtils from "../../../utils/duel/DuelistUtils"
import type Item from "../../../utils/items/Item"
import ExperienceUtils from "../../../utils/level/ExperienceUtils"
import Logger from "../../../utils/logs/Logger"
import RandomUtils from "../../../utils/math/RandomUtils"
import Duelist from "../../entities/duel/Duelist"
import BaseService from "../base/BaseService"
import InventoryItemService from "../items/InventoryItemService"
import LevelService from "../level/LevelService"
import UserService from "../user/UserService"

type SaveOptions = {
    chatId: number
    id: number
    className: ClassTypes
    level: number
}

type AddOptions =
    & Pick<SaveOptions, 'chatId' | 'id'>
    & {
        key: 'mana' | 'hp' | 'shield'
        value: number
    }

type AddByItemOptions =
    & Pick<SaveOptions, 'chatId' | 'id'>
    & {
        item: Item
        count?: number
    }

type GunOptions =
    & Omit<AddByItemOptions, 'count' | 'id'>
    & {
        owner: number
        target: number
        ctx: BotContext
    }

type GunResult =
    | {
        ok: true
        damage: number
        shieldDestroyed: boolean
        isDead: boolean
    }
    | {
        ok: false
        reason: string
    }

class DuelistService extends BaseService<typeof Duelist> {
    constructor() {
        super(Duelist)
    }

    async get(chatId: number, id: number): Promise<Duelist> {
        const found = await this._repo.findOne(
            {
                chatId,
                id
            }
        )
        Logger.debug(
            'DuelistService.get',
            {
                found
            }
        )
        if (!found) {
            return await this._repo.create(
                new Duelist({ chatId, id })
            )
        }

        const level = ExperienceUtils.getLevelFromObject(await LevelService.get(chatId, id))
        const className = (await UserService.get(chatId, id))?.className ?? ClassUtils.defaultClassName
        const { hp: maxHp, mana: maxMana } = characters[className].getMaxCharacteristics(level)

        Logger.debug(
            'DuelistService.get',
            {
                maxHp,
                maxMana
            }
        )

        if (found.hp > maxHp || found.mana > maxMana) {
            return (await this._repo.updateOne(
                {
                    chatId,
                    id
                },
                {
                    hp: maxHp,
                    mana: maxMana
                }
            ))!
        }

        return found
    }

    async canSave(chatId: number, id: number): Promise<CanSaveDuelistResult> {
        const duelist = await this.get(chatId, id)
        return DuelistUtils.canSave(duelist)
    }

    async save({
        chatId,
        id,
        className,
        level,
    }: SaveOptions): Promise<Duelist | undefined> {
        const character = characters[className]
        const { hp, mana } = character.getMaxCharacteristics(level)

        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                hp,
                mana,
                lastSave: new Date()
            }
        )
    }
    
    async resetSave(chatId: number, id: number): Promise<Duelist | undefined> {
        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                lastSave: new Date(0)
            }
        )
    }

    async add({
        chatId,
        id,
        value,
        key
    }: AddOptions): Promise<Duelist | undefined> {
        return await this._repo.model.findOneAndUpdate(
            {
                chatId,
                id
            },
            {
                $inc: {
                    [key]: value
                }
            },
            {
                lean: true,
                returnDocument: 'after',
            }
        ) ?? undefined
    }

    async addShield({
        chatId,
        id,
        item,
        count = 1
    }: AddByItemOptions): Promise<Duelist | undefined> {
        if (!item.shield) return undefined
        return await this.add({
            chatId,
            id,
            key: 'shield',
            value: item.shield.durability * count
        })
    }

    async dead(chatId: number, id: number): Promise<Duelist | undefined> {
        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                hp: DEAD_HEALTH
            })
    }

    async gun({
        chatId,
        owner,
        target,
        item,
        ctx
    }: GunOptions): Promise<GunResult> {
        if (!item.gun) {
            return {
                ok: false,
                reason: 'not-gun'
            }
        }

        const itemUseResult = await InventoryItemService.use({
            chatId,
            id: owner,
            item: item.gun.ammo,
            ctx,
            isUseCallback: false
        })

        if (!itemUseResult.ok) {
            return {
                ok: false,
                reason: 'no-ammo'
            }
        }

        const [min, max] = item.gun.damage
        const damage = RandomUtils.range(min, max)

        const duelist = await this.get(
            chatId,
            target
        )

        const newRawShield = duelist.shield - damage
        const newShield = Math.max(MIN_SHIELD, newRawShield)
        const shieldDestroyed = newRawShield < MIN_SHIELD
        const newHp = duelist.hp + Math.min(MIN_SHIELD, newRawShield)

        await this._repo.updateOne(
            {
                chatId,
                id: target,
            },
            {
                hp: newHp,
                shield: newShield
            }
        )

        return {
            ok: true,
            damage,
            shieldDestroyed,
            isDead: ctx.me.id != target && newHp <= DEAD_HEALTH
        }
    }
}

export default new DuelistService()