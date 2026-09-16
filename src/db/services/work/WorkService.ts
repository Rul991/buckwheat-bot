import { CATALOG_WORK_COOLDOWN, DEFAULT_WORK_COOLDOWN } from "../../../consts/time"
import { workCatalogItem } from "../../../resources/items/inventory"
import TimeUtils from "../../../utils/time/TimeUtils"
import Work from "../../entities/work/Work"
import BaseService from "../base/BaseService"
import InventoryItemService from "../items/InventoryItemService"

type CanWorkResult = {
    ok: boolean,
    remainingTime: number
}

class WorkService extends BaseService<typeof Work> {
    constructor() {
        super(Work)
    }

    async get(chatId: number, id: number): Promise<Work> {
        return this._repo.getOrCreate(
            {
                chatId,
                id
            },
            new Work({ chatId, id })
        )
    }

    async canWork(chatId: number, id: number): Promise<CanWorkResult> {
        const work = await this.get(chatId, id)
        const hasCatalog = await InventoryItemService.hasByUser(
            {
                chatId,
                id,
                item: workCatalogItem
            }
        )

        const elapsedTime = TimeUtils.getElapsed(+work.lastWork)
        const needTime = hasCatalog ? CATALOG_WORK_COOLDOWN : DEFAULT_WORK_COOLDOWN
        const remainingTime = needTime - elapsedTime

        const isExpired = TimeUtils.isExpired(
            +work.lastWork,
            needTime
        )

        return {
            ok: isExpired,
            remainingTime
        }
    }

    async updateTime(chatId: number, id: number, date?: Date): Promise<Work | undefined> {
        return this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                lastWork: date ?? new Date()
            }
        )
    }

    async skip(chatId: number, id: number, ms: number): Promise<Work | undefined> {
        const work = await this.get(chatId, id)
        const newDate = new Date(+work.lastWork - ms)

        return await this.updateTime(chatId, id, newDate)
    }
}

export default new WorkService()