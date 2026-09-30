import GreedBox from "../../entities/greed-box/GreedBox"
import BaseService from "../base/BaseService"

class GreedBoxService extends BaseService<typeof GreedBox> {
    constructor() {
        super(GreedBox)
    }

    async use(chatId: number, id: number): Promise<GreedBox> {
        return (await this._repo.model.findOneAndUpdate(
            {
                chatId,
                id
            },
            {
                $inc: {
                    used: 1
                }
            },
            {
                lean: true,
                returnDocument: 'after',
                upsert: true
            }
        ))!
    }

    async zero(chatId: number, id: number): Promise<GreedBox | undefined> {
        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                used: 0
            }
        )
    }
}

export default new GreedBoxService()