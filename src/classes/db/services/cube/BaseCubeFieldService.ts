import Cube from '../../../../interfaces/schemas/Cube'
import CubeRepository from '../../repositories/CubeRepository'
import CubeService from './CubeService'

export default class BaseCubeFieldService<K extends keyof Cube, V extends Cube[K]> {
    protected _key: K
    protected _defaultValue: V

    constructor(key: K, defaultValue: V) {
        this._key = key
        this._defaultValue = defaultValue
    }

    async get(chatId: number, id: number): Promise<V> {
        return ((await CubeService.get(chatId, id))[this._key] ?? this._defaultValue) as V
    }

    async set(chatId: number, id: number, value: V = this._defaultValue): Promise<Cube | null> {
        return await CubeRepository.updateOne(chatId, id, {[this._key]: value})
    }

    async add(chatId: number, id: number, value = 1): Promise<number | null> {
        const currentValue = await this.get(chatId, id) as number

        if(typeof value == typeof currentValue) {
            const addedValue = currentValue + value
            await this.set(chatId, id, addedValue as V)
            return addedValue
        }
        else return null
    }
}