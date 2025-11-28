import Casino from '../../../../interfaces/schemas/games/Casino'
import CasinoRepository from '../../repositories/CasinoRepository'

type GetAllResult<K extends keyof Casino> = {
    id: number,
    value: Exclude<Casino[K], undefined>
}

export default class {
    private static async _getAll<K extends keyof Casino>(chatId: number, key: K): Promise<GetAllResult<K>[]> {
        const casinos = await CasinoRepository.findManyInChat(
            chatId
        )

        return casinos
            .map(v => ({
                value: v[key],
                id: v.id
            }))
            .filter(({value}) => value !== undefined) as GetAllResult<K>[]
    }

    static async money(chatId: number) {
        return this._getAll(chatId, 'money')
    }
}