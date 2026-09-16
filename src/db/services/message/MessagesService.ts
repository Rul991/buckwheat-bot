import type { TopValues } from "../../../types/top"
import type { MessagesType } from "../../../types/types"
import Messages from "../../entities/message/Messages"
import BaseService from "../base/BaseService"

class MessagesService extends BaseService<typeof Messages> {
    private _types: MessagesType[] = ['total', 'year', 'month', 'day']

    constructor() {
        super(Messages)
    }

    async get(chatId: number, id: number, type: MessagesType = 'total'): Promise<Messages> {
        return await this._repo.getOrCreate(
            {
                chatId,
                id,
                type
            },
            new Messages({
                chatId,
                id,
                type
            })
        )
    }

    async getAllByUser(chatId: number, id: number): Promise<Messages[]> {
        return this._repo.find({
            chatId,
            id
        })
    }

    async add(chatId: number, id: number, type: MessagesType = 'total'): Promise<Messages | undefined> {
        await this.get(chatId, id, type)
        return await this._repo.model.findOneAndUpdate(
            {
                chatId,
                id,
                type
            },
            {
                $inc: {
                    count: 1
                }
            },
            {
                lean: true,
                returnDocument: 'after'
            }
        ) ?? undefined
    }

    async addForEveryTypes(chatId: number, id: number) {
        const setOnInsertOperations = this._types.map((type) => {
            const filter = { chatId, id, type }
            return {
                updateOne: {
                    filter,
                    update: {
                        $setOnInsert: new Messages(filter),
                    },
                    upsert: true,
                },
            }
        })

        const addCountOperations = this._types.map((type) => {
            const filter = { chatId, id, type }
            return {
                updateOne: {
                    filter,
                    update: {
                        $inc: {
                            count: 1
                        },
                    },
                },
            }
        })

        await this._repo.model.bulkWrite(setOnInsertOperations)
        await this._repo.model.bulkWrite(addCountOperations)
    }

    async getAllByChatId(chatId: number, type: MessagesType): Promise<Messages[]> {
        return await this._repo.find({
            chatId,
            type
        })
    }

    async getUnsortedTopValues(chatId: number, type: MessagesType): Promise<TopValues[]> {
        const messages = await this.getAllByChatId(chatId, type)
        return messages
            .filter(v => v.count > 0)
            .map(v => {
                return {
                    value: v.count,
                    id: v.id
                }
            })
    }
}

export default new MessagesService()