import type User from "../../entities/user/User"
import BaseUserService from "./BaseUserService"

class UserUsernameService extends BaseUserService<'username'> {
    constructor() {
        super('username')
    }

    override async get(chatId: number, id: number): Promise<string> {
        return await super.get(chatId, id) ?? ''
    }

    override async set(chatId: number, id: number, value: string | undefined): Promise<User | undefined> {
        return super.set(chatId, id, value?.toLowerCase())
    }
}

export default new UserUsernameService()