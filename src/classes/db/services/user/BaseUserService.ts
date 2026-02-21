import User from '../../../../interfaces/schemas/user/User'
import UserProfileService from './UserProfileService'

export default class BaseUserService {
    static async get<Key extends keyof User>(chatId: number, id: number, key: Key): Promise<User[Key] | null> {
        const user = await UserProfileService.get(chatId, id)
        return user?.[key] as User[Key] | null
    }

    static async update<Key extends keyof User>(chatId: number, id: number, key: Key, data: User[Key]): Promise<User[Key] | null> {
        const updatedUser = await UserProfileService.update(chatId, id, {[key]: data})
        
        if(!updatedUser) return null
        else return updatedUser[key] as User[Key]
    }
}