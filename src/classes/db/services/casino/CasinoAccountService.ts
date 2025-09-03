import Casino from '../../../../interfaces/schemas/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'

type T = Casino

export default class CasinoAccountService {
    static async create(chatId: number, id: number): Promise<T> {
        const casino = await CasinoAccountService.get(chatId, id)
        
        if(casino) return casino
        else return await CasinoRepository.create({chatId, id})
    }

    static async has(chatId: number, id: number): Promise<boolean> {
        const obj = await this.get(chatId, id)

        return Boolean(obj)
    }

    static async get(chatId: number, id: number): Promise<T | null> {
        return await CasinoRepository.findOne(chatId, id)
    }
}