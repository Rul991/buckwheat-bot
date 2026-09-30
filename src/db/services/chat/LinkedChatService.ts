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
        const chat = await this.create(
            new LinkedChat({
                id,
                linkedChat
            })
        )
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

        return result.modifiedCount > 0
    }

    async remove(id: number, linkedChat: number): Promise<boolean> {
        const result = await this._repo.model.updateOne(
            {
                id
            },
            {
                $set: {
                    linkedChat: undefined
                },
                $pull: {
                    linkedChats: linkedChat
                }
            }
        ).exec()

        return result.modifiedCount > 0
    }

    async relink(id: number) {
        const linkedChat = await this.get(id)
        if(!linkedChat?.linkedChats[0]) return undefined

        const newLinkedChat = linkedChat.linkedChats[0]
        const isSet = await this.set(
            id,
            newLinkedChat
        )

        return isSet ? newLinkedChat : undefined
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
        const isPrivate = (ctx.chat && ctx.chat.type == 'private') ?? true

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