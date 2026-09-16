import AvaHistory from "../../entities/user/AvaHistory"
import type User from "../../entities/user/User"
import BaseUserService from "./BaseUserService"
import UserService from "./UserService"

class UserAvaService extends BaseUserService<'currentAva'> {
    constructor() {
        super('currentAva')
    }

    override async set(chatId: number, id: number, value: AvaHistory | undefined): Promise<User | undefined> {
        if(!value) return super.set(chatId, id, new AvaHistory({ fileId: '' }))

        const user = await UserService.get(chatId, id)
        if(!user) return undefined

        const avaHistory = user.avaHistory
        avaHistory.push(value)

        const result = await UserService.updateOne(
            chatId,
            id,
            {
                avaHistory,
                currentAva: value
            }
        )

        return result
    }
}

export default new UserAvaService()