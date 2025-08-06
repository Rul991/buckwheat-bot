import BaseUserService from './BaseUserService'

export default class UserDescriptionService {
    static async get(id: number): Promise<string | null> {
        return (await BaseUserService.get<string>(id, 'description'))
    }

    static async update(id: number, description: string): Promise<string | null> {
        return (await BaseUserService.update(id, 'description', description))
    }
}