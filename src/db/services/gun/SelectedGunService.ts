import type Item from "../../../utils/items/Item"
import SelectedGun from "../../entities/gun/SelectedGun"
import BaseService from "../base/BaseService"

class SelectedGunService extends BaseService<typeof SelectedGun> {
    constructor() {
        super(SelectedGun)
    }

    async get(chatId: number, id: number): Promise<SelectedGun> {
        return this._repo.getOrCreate(
            {
                chatId,
                id
            },
            new SelectedGun({ chatId, id })
        )
    }

    async set(chatId: number, id: number, item: Item): Promise<SelectedGun> {
        return await this._repo.updateOrCreate(
            {
                chatId,
                id
            },
            new SelectedGun({
                chatId,
                id,
                item
            })
        )
    }
}

export default new SelectedGunService()