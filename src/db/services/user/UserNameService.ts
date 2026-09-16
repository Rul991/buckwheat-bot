import type User from "../../entities/user/User"
import BaseUserService from "./BaseUserService"
import UserService from "./UserService"

class UserNameService extends BaseUserService<'name'> {
    constructor() {
        super('name')
    }

    override async set(chatId: number, id: number, value: string): Promise<User | undefined> {
        return super.set(chatId, id, await UserService.getUniqueName(chatId, value))
    }
}

export default new UserNameService()