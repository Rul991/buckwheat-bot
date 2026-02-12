import AvaHistoryService from './AvaHistoryService'
import BaseUserService from './BaseUserService'

export default class UserImageService {
    static async get(chatId: number, id: number): Promise<string> {
        return await BaseUserService.get(chatId, id, 'imageId') ?? ''
    }

    static async update(chatId: number, id: number, image: string): Promise<string> {
        await AvaHistoryService.add(chatId, id, image)
        return await BaseUserService.update(chatId, id, 'imageId', image) ?? ''
    }
}