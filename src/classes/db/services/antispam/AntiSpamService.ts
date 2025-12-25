import AntiSpam from '../../../../interfaces/schemas/other/AntiSpam'
import TimeUtils from '../../../../utils/TimeUtils'
import { DENY_NUMBER, MAX_MESSAGES_PER_TIME, MILLISECONDS_IN_SECOND, NOT_SPAM_TIME } from '../../../../utils/values/consts'
import AntiSpamRepository from '../../repositories/AntiSpamRepository'
import ChatSettingsService from '../settings/ChatSettingsService'

export default class AntiSpamService {
    static async get(id: number, key: keyof AntiSpam): Promise<number> {
        const spam = await AntiSpamRepository.findOne(id)

        if(!spam) return (await AntiSpamRepository.create({id}))[key]!
        else return spam[key]!
    }

    static async set(id: number, key: keyof AntiSpam, data: number): Promise<number> {
        const spam = await AntiSpamRepository.updateOne(id, {[key]: data})

        if(!spam) return (await AntiSpamRepository.create({id, [key]: data}))[key]!
        else return spam[key]!
    }

    static async add(id: number, key: keyof AntiSpam, data: number): Promise<number> {
        const currentState = await this.get(id, key)
        const spam = await AntiSpamRepository.updateOne(id, {[key]: data + currentState})

        if(!spam) return (await AntiSpamRepository.create({id, [key]: data}))[key]!
        else return spam[key]!
    }

    static async updateTimeIfNeed(chatId: number, id: number): Promise<boolean> {
        const time = await AntiSpamService.get(id, 'lastMessageGroupTime')
        const notSpamTime = (await ChatSettingsService.get<'number'>(
            chatId,
            'notSpamTime'
        ) ?? NOT_SPAM_TIME) * MILLISECONDS_IN_SECOND

        if(notSpamTime == 0)
            return true

        if(TimeUtils.isTimeExpired(time, notSpamTime)) {
            await AntiSpamRepository.updateOne(id, {
                lastMessageGroupTime: Date.now(), 
                lastMessagesCount: 0
            })

            return true
        }

        return false
    }

    static async isSpamming(chatId: number, id: number): Promise<boolean> {
        await this.updateTimeIfNeed(chatId, id)
        const count = await AntiSpamService.get(id, 'lastMessagesCount')
        const maxCount = await ChatSettingsService.get<'number'>(
            chatId, 
            'messagePerTime'
        ) ?? MAX_MESSAGES_PER_TIME

        return maxCount != DENY_NUMBER && count >= maxCount
    }
}