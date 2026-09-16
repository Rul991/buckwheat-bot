import ScrollerCache from "../../entities/scroller-cache/ScrollerCache"
import BaseService from "../base/BaseService"

class ScrollerCacheService extends BaseService<typeof ScrollerCache> {
    constructor() {
        super(ScrollerCache)
    }

    override async create(obj: ScrollerCache): Promise<ScrollerCache> {
        return await this._repo.updateOrCreate(
            {
                chatId: obj.chatId,
                msgId: obj.msgId
            },
            obj
        )
    }

    async get(chatId: number, msgId: number): Promise<ScrollerCache | undefined> {
        return this._repo.findOne({
            chatId,
            msgId
        })
    }
}

export default new ScrollerCacheService()