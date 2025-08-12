import User from '../../../../interfaces/schemas/User'
import StringUtils from '../../../../utils/StringUtils'
import UserRepository from '../../repositories/UserRepository'

export default class UserProfileService {
    static async create(id: number, name: string): Promise<User | null> {
        const foundUser = await UserRepository.findOne(id)
        if(foundUser) return null

        const user = await UserRepository.create({
            id,
            name,
        })

        return user
    }

    static async update(id: number, profile: Partial<User>): Promise<User | null> {
        await this.create(id, '')

        for (const key in profile) {
            //@ts-ignore
            if(typeof profile[key] == 'string') {
                //@ts-ignore
                profile[key] = StringUtils.validate(profile[key])
            }
        }

        return await UserRepository.updateOne(id, profile)
    }

    static async get(id: number): Promise<User | null> {
        return await UserRepository.findOne(id)
    }

    static async getAll(): Promise<User[]> {
        return await UserRepository.findMany()
    }

    static async getMembersCount(): Promise<number> {
        return (await UserRepository.findMany()).length
    }
}