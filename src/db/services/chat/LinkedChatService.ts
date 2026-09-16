import type { BotContext } from "../../../types/bot"
import LinkedChat from "../../entities/chat/LinkedChat"
import BaseService from "../base/BaseService"

class LinkedChatService extends BaseService<typeof LinkedChat> {
    constructor() {
        super(LinkedChat)
    }

    override async create(chat: LinkedChat): Promise<LinkedChat> {
        return await this._repo.getOrCreate(
            {
                id: chat.id
            },
            chat
        )
    }

    async set(id: number, linkedChat: number): Promise<boolean> {
        const chat = await this.get(id)
        if(chat?.linkedChat == linkedChat) return false

        const result = await this._repo.model.updateOne(
            {
                id
            },
            {
                linkedChat,
                $addToSet: {
                    linkedChats: linkedChat
                }
            }
        ).exec()

        return result.acknowledged
    }

    async isLinked(id: number, linkedChat: number): Promise<boolean> {
        const chat = await this.get(id)
        return chat?.linkedChat == linkedChat
    }

    async get(id: number): Promise<LinkedChat | undefined> {
        return this._repo.findOne({
            id
        })
    }

    async getCurrent(ctx: BotContext, id?: number): Promise<number | undefined> {
        const isPrivate = ctx.chat?.type == 'private'

        if (isPrivate) {
            const linkedChat = id ?
                await this.create(new LinkedChat({ id })) :
                undefined
            return linkedChat?.linkedChat
        }

        return ctx.chatId
    }
}

export default new LinkedChatService()