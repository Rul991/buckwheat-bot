import Casino from '../../../../interfaces/schemas/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'
import CasinoAccountService from './CasinoAccountService'

type T = Casino

export default class CasinoAddService {
    private static async _add(chatId: number, id: number, key: keyof T, value: number): Promise<number> {
        const casino = await CasinoAccountService.get(chatId, id)
        const newValue = casino[key]! + value
        const newCasino = await CasinoRepository.updateOne(chatId, id, {[key]: isNaN(newValue) ? 0 : newValue})
        if(!newCasino) return -1

        return newCasino[key] ?? -1
    }

    static async money(chatId: number, id: number, money: number): Promise<number> {
        return await this._add(chatId, id, 'money', Math.floor(money))
    }

    static async loses(chatId: number, id: number, loses: number): Promise<number> {
        return await this._add(chatId, id, 'loses', loses)
    }

    static async wins(chatId: number, id: number, wins: number): Promise<number> {
        return await this._add(chatId, id, 'wins', wins)
    }
}