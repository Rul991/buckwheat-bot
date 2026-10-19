import { deleteUserMinCountSetting } from "../../../resources/settings/chat"
import type { TopValues } from "../../../types/top"
import type { MessagesType } from "../../../types/unions"
import Messages from "../../entities/message/Messages"
import type User from "../../entities/user/User"
import BaseService from "../base/BaseService"
import SettingValueService from "../settings/SettingValueService"
import UserService from "../user/UserService"

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

    async getTotalUnactiveUsers(chatId: number, meId: number): Promise<(User & { messages: number })[]> {
        const messages = await this._repo.find({
            type: 'total',
            count: {
                $lt: await SettingValueService.getValue({
                    id: chatId,
                    setting: deleteUserMinCountSetting
                }),
            },
            chatId
        })
        const users = await UserService.getAllByIds(
            chatId,
            messages
                .map(message => message.id)
        )

        return messages
            .filter(v => v.id !== meId)
            .map(v => {
                const user = users.get(v.id)
                if (!user) return undefined

                return {
                    ...user,
                    messages: v.count
                }
            })
            .filter(v => v !== undefined)
    }
}

export default new MessagesService()