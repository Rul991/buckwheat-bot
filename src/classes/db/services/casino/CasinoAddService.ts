import Casino from '../../../../interfaces/schemas/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'
import CasinoAccountService from './CasinoAccountService'

type T = Casino

export default class CasinoAddService {
    private static async _add(id: number, key: keyof T, value: number): Promise<number> {
        const casino = await CasinoAccountService.create(id)
        const newCasino = await CasinoRepository.updateOne(id, {[key]: casino[key]! + value})
        if(!newCasino) return -1

        return newCasino[key] ?? -1
    }

    static async addMoney(id: number, money: number): Promise<number> {
        return await this._add(id, 'money', Math.floor(money))
    }

    static async addLoses(id: number, loses: number): Promise<number> {
        return await this._add(id, 'loses', loses)
    }

    static async addWins(id: number, wins: number): Promise<number> {
        return await this._add(id, 'wins', wins)
    }
}