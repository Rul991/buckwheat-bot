import Chat from "../../entities/chat/Chat"
import BaseService from "../base/BaseService"

class ChatService extends BaseService<typeof Chat> {
    constructor() {
        super(Chat)
    }

    override async create(chat: Chat): Promise<Chat> {
        return this._repo.getOrCreate(
            {
                id: chat.id,
            },
            chat
        )
    }

    async get(chatId: number): Promise<Chat | undefined> {
        return await this._repo.findOne({
            id: chatId
        })
    }

    async update(chatId: number, chat: Partial<Chat>): Promise<Chat | undefined> {
        return await this._repo.updateOne(
            {
                id: chatId
            },
            chat
        )
    }

    async togglePublic(chatId: number): Promise<Chat | undefined> {
        return await this._repo.model.findOneAndUpdate(
            {
                id: chatId
            },
            [
                {
                    $set: {
                        isPublic: {
                            $not: '$isPublic'
                        }
                    }
                }
            ],
            {
                lean: true,
                returnDocument: 'after',
                updatePipeline: true
            }
        ) ?? undefined
    }

    async count(): Promise<number> {
        return await this._repo.count()
    }
}

export default new ChatService()