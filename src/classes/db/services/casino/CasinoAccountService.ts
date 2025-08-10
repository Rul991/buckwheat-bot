import Casino from '../../../../interfaces/schemas/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'

type T = Casino

export default class CasinoAccountService {
    static async create(id: number): Promise<T> {
        const casino = await CasinoAccountService.get(id)
        
        if(casino) return casino
        else return await CasinoRepository.create({id})
    }

    static async has(id: number): Promise<boolean> {
        const obj = await CasinoRepository.findOne(id)

        return Boolean(obj)
    }

    static async get(id: number): Promise<T | null> {
        return await CasinoRepository.findOne(id)
    }
}