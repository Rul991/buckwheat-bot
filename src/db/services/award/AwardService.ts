import Award from "../../entities/award/Award"
import BaseService from "../base/BaseService"

class AwardService extends BaseService<typeof Award> {
    constructor() {
        super(Award)
    }

    async delete(awardId: number): Promise<boolean> {
        const deleteResult = await this._repo.deleteOne({
            awardId
        })

        return deleteResult.deletedCount > 0
    }

    async get(awardId: number): Promise<Award | undefined> {
        return await this._repo.findOne({ awardId })
    }

    async count(chatId: number, id: number): Promise<number> {
        return await this._repo.count({ chatId, id })
    }

    async getAllByUser(chatId: number, id: number): Promise<Award[]> {
        return this._repo.find({ chatId, id })
    }
}

export default new AwardService()