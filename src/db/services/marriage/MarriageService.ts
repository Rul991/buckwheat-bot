import Marriage from "../../entities/marriage/Marriage"
import BaseService from "../base/BaseService"

class MarriageService extends BaseService<typeof Marriage> {
    constructor() {
        super(Marriage)
    }

    override async create(obj: Marriage): Promise<Marriage> {
        return await this._repo.getOrCreate(
            {
                chatId: obj.chatId,
                firstPartner: obj.firstPartner,
                secondPartner: obj.secondPartner
            },
            obj
        )
    }

    async get(chatId: number, id: number): Promise<Marriage | undefined> {
        return await this._repo.findOne(
            {
                chatId,
                $or: [
                    {
                        firstPartner: id
                    },
                    {
                        secondPartner: id
                    }
                ]
            }
        )
    }

    async delete(chatId: number, id: number) {
        const result = await this._repo.deleteOne(
            {
                chatId,
                $or: [
                    {
                        firstPartner: id
                    },
                    {
                        secondPartner: id
                    }
                ]
            }
        )

        return result.deletedCount > 0
    }

    async getAllByChatId(chatId: number): Promise<Marriage[]> {
        return await this._repo.find({
            chatId
        })
    }
}

export default new MarriageService()