import Duel from "../../entities/duel/Duel"
import BaseService from "../base/BaseService"

class DuelService extends BaseService<typeof Duel> {
    constructor() {
        super(Duel)
    }

    override async create(obj: Duel): Promise<Duel> {
        return await this._repo.getOrCreate(
            {
                chatId: obj.chatId
            },
            obj
        )
    }

    async getByChatId(chatId: number) {
        return await this._repo.findOne({ chatId })
    }
}

export default new DuelService()