import BaseUserService from './BaseUserService'

export default class UserImageService {
    static async get(id: number): Promise<string> {
        return await BaseUserService.get<string>(id, 'imageId') ?? ''
    }

    static async update(id: number, image: string): Promise<string> {
        return await BaseUserService.update(id, 'imageId', image) ?? ''
    }
}