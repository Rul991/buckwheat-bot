import { UpdateQuery } from 'mongoose'
import Characteristics from '../../../../interfaces/duel/Characteristics'
import Duelist from '../../../../interfaces/schemas/duels/Duelist'
import DuelUtils from '../../../../utils/DuelUtils'
import { ClassTypes, TypeKeys } from '../../../../utils/values/types'
import DuelistRepository from '../../repositories/DuelistRepository'
import LevelService from '../level/LevelService'
import UserClassService from '../user/UserClassService'
import MathUtils from '../../../../utils/MathUtils'
import { Context } from 'telegraf'
import LinkedChatService from '../linkedChat/LinkedChatService'
import MessageUtils from '../../../../utils/MessageUtils'

export default class DuelistService {
    static async get(chatId: number, id: number, type?: ClassTypes): Promise<Duelist> {
        const duelist = await DuelistRepository.findOne(chatId, id)
        if(duelist) return duelist
        else {
            const maxChars = await this.getMaxCharacteristics(chatId, id, type)
            return await DuelistRepository.create({chatId, id, ...maxChars})
        }
    }

    static async set(chatId: number, id: number, data: UpdateQuery<Duelist>): Promise<Duelist | null> {
        return await DuelistRepository.updateOne(
            chatId,
            id,
            data
        )
    }

    static async getField<Key extends keyof Duelist>(chatId: number, id: number, key: Key): Promise<Duelist[Key]> {
        const duelist = await this.get(chatId, id)
        return duelist[key]
    }

    static async onDuel(chatId: number, id: number): Promise<boolean> {
        return await this.getField(chatId, id, 'onDuel') ?? false
    }

    static async setField<Key extends keyof Duelist>(
        chatId: number, 
        id: number, 
        key: Key, 
        value: Duelist[Key]
    ): Promise<Duelist[Key]> {
        await this.set(
            chatId,
            id,
            {
                [key]: value
            }
        )

        return value
    }

    static async addField<Key extends TypeKeys<Duelist, number | undefined>>(
        chatId: number, 
        id: number, 
        key: Key, 
        value: number = 1
    ): Promise<Key extends never ? null : number> {
        type DuelistKeys = keyof Duelist
        type Result = Key extends never ? null : number

        const currentValue = await this.getField(
            chatId, 
            id, 
            key as DuelistKeys
        ) ?? 0

        if(typeof currentValue != 'number') 
            return null as Result

        const newValue = value + currentValue
        const result = isNaN(newValue) ? currentValue : newValue

        return await this.setField(
            chatId,
            id,
            key as DuelistKeys,
            Math.floor(result)
        ) as Result
    }

    static async getMaxCharacteristics(chatId: number, id: number, type?: ClassTypes): Promise<Characteristics> {
        const level = await LevelService.get(chatId, id)
        const usedType = type ?? await UserClassService.get(chatId, id)
        const maxChars = await DuelUtils.getMaxCharacteristicsFromFile(usedType, level)

        return maxChars ?? {hp: 0, mana: 0}
    }

    static async getCurrentCharacteristics(chatId: number, id: number): Promise<Characteristics> {
        const duelist = await this.get(chatId, id)
        const {hp: maxHp, mana: maxMana} = await this.getMaxCharacteristics(chatId, id)

        const clamp = (curr: number, max: number) => 
            MathUtils.clamp(
                curr, 
                Number.MIN_SAFE_INTEGER, 
                max
            )

        const hp = clamp(duelist.hp, maxHp)
        const mana = clamp(duelist.mana, maxMana)

        if(duelist.hp > hp || duelist.mana > mana) {
            await this.set(
                chatId,
                id,
                {hp, mana}
            )
        }

        return {
            hp,
            mana
        }
    }

    static async save(chatId: number, id: number, type?: ClassTypes): Promise<void> {
        const usedType = type ?? await UserClassService.get(chatId, id)
        const max = await this.getMaxCharacteristics(chatId, id, usedType)

        await DuelistRepository.updateOne(chatId, id, {
            ...max,
            lastSave: Date.now()
        })
    }

    static async deleteAndUpdateLastMessage(ctx: Context, messageId: number) {
        const key = 'lastMessage'
        const id = ctx.from?.id
        if(!id) return

        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const lastMessage = await this.getField(chatId, id, key)
        if(lastMessage) {
            await MessageUtils.deleteMessage(ctx, lastMessage)
        }

        await this.setField(chatId, id, key, messageId)
    }
}