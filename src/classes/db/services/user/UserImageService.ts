import BaseUserService from './BaseUserService'

export default class UserImageService {
    static async get(chatId: number, id: number): Promise<string> {
        return await BaseUserService.get<string>(chatId, id, 'imageId') ?? ''
    }

    static async update(chatId: number, id: number, image: string): Promise<string> {
        return await BaseUserService.update(chatId, id, 'imageId', image) ?? ''
    }
}