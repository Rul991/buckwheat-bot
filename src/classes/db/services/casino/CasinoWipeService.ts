import Casino from '../../../../interfaces/schemas/games/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'

export default class CasinoWipeService {
    private static async _wipe(chatId: number, key: keyof Casino) {
        await CasinoRepository.updateMany(chatId, {
            $set: {
                [key]: 0
            }
        })
    }

    static async money(chatId: number): Promise<void> {
        await this._wipe(chatId, 'money')
    }

    static async loses(chatId: number): Promise<void> {
        await this._wipe(chatId, 'loses')
    }

    static async wins(chatId: number): Promise<void> {
        await this._wipe(chatId, 'wins')
    }

    static async all(chatId: number): Promise<void> {
        await this.money(chatId)
        await this.loses(chatId)
        await this.wins(chatId)
    }
}