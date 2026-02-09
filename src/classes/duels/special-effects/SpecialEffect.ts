import { GenericSpecialEffectOptions, SpecialEffectGetOptions } from '../../../utils/values/types/duels'

export default abstract class<O extends object = {}> {
    protected abstract _name: string
    protected abstract _get(options: GenericSpecialEffectOptions<O>): Promise<number>
    protected _options: O

    constructor(options: O) {
        this._options = options
    }

    async get(options: SpecialEffectGetOptions): Promise<number> {
        return await this._get({
            ...options as SpecialEffectGetOptions,
            ...this._options
        })
    }
}