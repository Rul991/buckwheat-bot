import Casino from '../../../../interfaces/schemas/games/Casino'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import CasinoRepository from '../../repositories/CasinoRepository'

type T = Casino

export default class CasinoAddService {
    private static async _add(chatId: number, id: number, key: keyof T, value: number): Promise<number> {
        const newCasino = await CasinoRepository.updateOne(
            chatId, 
            id, 
            {
                $inc: {
                    [key]: value
                }
            }
        )
        if(!newCasino) return NOT_FOUND_INDEX

        return newCasino[key] ?? NOT_FOUND_INDEX
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