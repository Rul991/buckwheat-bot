import { WORK_TIME } from '../../../../utils/values/consts'
import WorkRepository from '../../repositories/WorkRepository'
import WorkService from './WorkService'

export default class WorkTimeService {
    static async getElapsedTime(chatId: number, id: number, workTime = WORK_TIME): Promise<number> {
        const time = await this.get(chatId, id)

        const now = Date.now()
        const elapsed = now - time

        if (elapsed >= workTime) {
            this.set(chatId, id, now)
            return 0
        }
        else {
            return elapsed
        }
    }

    static async get(chatId: number, id: number): Promise<number> {
        const work = await WorkService.get(chatId, id)
        return work?.lastWork ?? 0
    }

    static async set(chatId: number, id: number, time: number): Promise<number> {
        await WorkRepository.updateOne(chatId, id, {lastWork: time})
        return time
    }

    static async add(chatId: number, id: number, time: number): Promise<number> {
        const currentTime = await this.get(chatId, id)
        return await this.set(chatId, id, currentTime + time)
    }
}