import Casino from '../../../../interfaces/schemas/Casino'
import ArrayUtils from '../../../../utils/ArrayUtils'
import CasinoRepository from '../../repositories/CasinoRepository'
import CasinoAccountService from './CasinoAccountService'

type T = Casino

export default class CasinoGetService {
    private static async _get(chatId: number, id: number, key: keyof T): Promise<number> {
        const casino = await CasinoAccountService.create(chatId, id)

        if(!casino) {
            return -1
        }
        else {
            return casino[key]!
        }
    }
    
    static async getMoney(chatId: number, id: number): Promise<number> {
        return await this._get(chatId, id, 'money')
    }

    static async getLoses(chatId: number, id: number): Promise<number> {
        return await this._get(chatId, id, 'loses')
    }

    static async getWins(chatId: number, id: number): Promise<number> {
        return await this._get(chatId, id, 'wins')
    }

    static async getSortedCasinos(chatId: number, maxCount = 10): Promise<Casino[]> {
        const casinos = await CasinoRepository.findManyInChat(chatId)
        return ArrayUtils.filterAndSort(casinos, 'money', maxCount)
    }
}