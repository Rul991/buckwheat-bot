import Casino from '../../../../interfaces/schemas/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'

type T = Casino

export default class CasinoAccountService {
    static async get(chatId: number, id: number): Promise<T> {
        const casino = await CasinoRepository.findOne(chatId, id)
        
        if(casino) return casino
        else return await CasinoRepository.create({chatId, id})
    }
}