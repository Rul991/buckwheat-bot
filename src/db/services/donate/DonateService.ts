import type { TopValues } from "../../../types/top"
import Donate from "../../entities/donate/Donate"
import BaseService from "../base/BaseService"

class DonateService extends BaseService<typeof Donate> {
    constructor() {
        super(Donate)
    }

    async getTop(chatId: number): Promise<TopValues[]> {
        const map = new Map<number, number>()
        const ids = await this._repo.model.distinct(
            'id',
            {
                chatId
            }
        )
        const donates = await this._repo.find({
            id: {
                $in: ids
            }
        })

        for (const donate of donates) {
            const id = donate.id
            const stars = donate.stars

            map.set(
                id,
                stars + (map.get(id) ?? 0)
            )
        }

        return map.entries()
            .map(([id, stars]) => ({ id, value: stars }))
            .toArray()
    }
}

export default new DonateService()