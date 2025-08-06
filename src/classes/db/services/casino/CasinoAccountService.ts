import Casino from '../../../../interfaces/schemas/Casino'
import { DAILY_MONEY, MILLISECONDS_IN_DAY } from '../../../../utils/consts'
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

    static async updateDailyMoney(id: number): Promise<[T | null, boolean]> {
        const casino = await CasinoAccountService.create(id)
        const currentTime = Date.now()

        if((currentTime - casino.lastDeposite!) >= MILLISECONDS_IN_DAY) {
            let money = casino.money!

            if(money < DAILY_MONEY) {
                money = 20
            }

            return [
                await CasinoRepository.updateOne(id, {money, lastDeposite: currentTime}),
                true
            ]
        }
        else {
            return [
                casino,
                false
            ]
        }
    }
}