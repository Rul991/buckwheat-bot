import BaseUserService from './BaseUserService'

export default class UserLeftService {
    static async get(id: number): Promise<boolean | null> {
        return (await BaseUserService.get<boolean>(id, 'isLeft'))
    }

    static async update(id: number, left: boolean): Promise<boolean | null> {
        return (await BaseUserService.update(id, 'isLeft', left))
    }
}