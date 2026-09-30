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
        return await this._repo.updateOne(
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
            ]
        )
    }

    async toggleCanSummon(chatId: number): Promise<Chat | undefined> {
        return await this._repo.updateOne(
            {
                id: chatId
            },
            [
                {
                    $set: {
                        canUseSummonNow: {
                            $not: '$canUseSummonNow'
                        }
                    }
                }
            ]
        )
    }

    async count(): Promise<number> {
        return await this._repo.count()
    }

    async getByIds(ids: number[]): Promise<Map<number, Chat>> {
        const map = new Map<number, Chat>()
        const chats = await this._repo.find({
            id: {
                $in: ids
            }
        })

        for (const chat of chats) {
            map.set(chat.id, chat)
        }

        return map
    }
}

export default new ChatService()