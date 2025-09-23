import Cube from '../../../../interfaces/schemas/Cube'
import CubeRepository from '../../repositories/CubeRepository'

export default class CubeService {
    static async get(chatId: number, id: number): Promise<Cube> {
        const cube = await CubeRepository.findOne(chatId, id)
        if(cube) return cube
        else return await CubeRepository.create({chatId, id})
    }
}