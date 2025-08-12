import Casino from '../../../../interfaces/schemas/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'

type T = Casino

export default class CasinoGetService {
    private static async _get(id: number, key: keyof T): Promise<number> {
        const casino = await CasinoRepository.findOne(id)

        if(!casino) {
            return -1
        }
        else {
            return casino[key]!
        }
    }
    
    static async getMoney(id: number): Promise<number> {
        return await this._get(id, 'money')
    }

    static async getLoses(id: number): Promise<number> {
        return await this._get(id, 'loses')
    }

    static async getWins(id: number): Promise<number> {
        return await this._get(id, 'wins')
    }

    static async getSortedCasinos(): Promise<Casino[]> {
        const casinos = await CasinoRepository.findMany()
        return casinos
            .sort((a, b) => {
                return b.money! - a.money!
            })
            .filter((casino, i) => casino.money! > 0 && i < 10)
    }
}