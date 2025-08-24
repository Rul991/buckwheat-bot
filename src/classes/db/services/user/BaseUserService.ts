import User from '../../../../interfaces/schemas/User'
import UserProfileService from './UserProfileService'

export default class BaseUserService {
    static async get<T extends User[keyof User]>(id: number, key: keyof User): Promise<T | null> {
        const user = await UserProfileService.create(id)
        return user[key] as T
    }

    static async update<T>(id: number, key: keyof User, data: T): Promise<T | null> {
        const updatedUser = await UserProfileService.update(id, {[key]: data})
        
        if(!updatedUser) return null
        else return updatedUser[key] as T
    }
}