import AntiSpam from '../../../../interfaces/schemas/AntiSpam'
import { MAX_MESSAGES_PER_TIME, NOT_SPAM_TIME } from '../../../../utils/consts'
import AntiSpamRepository from '../../repositories/AntiSpamRepository'

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

    static async updateTimeIfNeed(id: number): Promise<boolean> {
        const time = await AntiSpamService.get(id, 'lastMessageGroupTime')

        if(Date.now() - time >= NOT_SPAM_TIME) {
            await AntiSpamRepository.updateOne(id, {lastMessageGroupTime: Date.now(), lastMessagesCount: 0})
            return true
        }

        return false
    }

    static async isSpamming(id: number): Promise<boolean> {
        await this.updateTimeIfNeed(id)
        const count = await AntiSpamService.get(id, 'lastMessagesCount')

        return count >= MAX_MESSAGES_PER_TIME
    }
}