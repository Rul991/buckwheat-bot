import type User from "../../entities/user/User"
import UserService from "./UserService"

export default class BaseUserService<K extends keyof User> {
    protected _key: K

    constructor(key: K) {
        this._key = key
    }

    async get(chatId: number, id: number): Promise<User[K] | undefined> {
        const user = await UserService.get(chatId, id)
        return user?.[this._key]
    }

    async set(chatId: number, id: number, value: User[K]): Promise<User | undefined> {
        const result = await UserService.updateOne(
            chatId,
            id,
            {
                [this._key]: value
            }
        )

        return result
    }

    async getAllByChatId(chatId: number): Promise<User[K][]> {
        const users = await UserService.getAllByChatId(chatId)
        return users.map(v => v[this._key])
    }
}