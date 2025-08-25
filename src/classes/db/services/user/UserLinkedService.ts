import BaseUserService from './BaseUserService'

export default class UserLinkedService {
    static async get(id: number): Promise<number | null> {
        return (await BaseUserService.get<number>(id, 'linkedChat'))
    }

    static async update(id: number, linkedChat: number): Promise<number | null> {
        return (await BaseUserService.update(id, 'linkedChat', linkedChat))
    }
}