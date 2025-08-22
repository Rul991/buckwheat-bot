import Work from '../../../../interfaces/schemas/Work'
import { WORK_TIME } from '../../../../utils/values/consts'
import WorkRepository from '../../repositories/WorkRepository'
import InventoryItemService from '../items/InventoryItemService'
import WorkService from './WorkService'

export default class WorkTimeService {
    static async getElapsedTime(id: number, workTime = WORK_TIME): Promise<number> {
        const time = await this.get(id)

        const now = Date.now()
        const elapsed = now - time

        if (elapsed >= workTime) {
            this.set(id, now)
            return 0
        }
        else {
            return elapsed
        }
    }

    static async get(id: number): Promise<number> {
        const work = await WorkService.get(id)
        return work?.lastWork ?? 0
    }

    static async set(id: number, time: number): Promise<number> {
        await WorkRepository.updateOne(id, {lastWork: time})
        return time
    }

    static async add(id: number, time: number): Promise<number> {
        const currentTime = await this.get(id)
        return await this.set(id, currentTime + time)
    }
}