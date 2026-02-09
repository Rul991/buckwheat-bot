import Effect from '../../interfaces/schemas/duels/Effect'
import { NOT_FOUND_INDEX } from '../values/consts'

export default class {
    private static _delete(effects: Effect[], callback: (effect: Effect) => boolean) {
        const index = effects.findIndex(callback)
        if (index !== NOT_FOUND_INDEX) {
            effects.splice(index, 1)
        }
        return effects
    }

    static add(currentEffects: Effect[], effects: Effect[]) {
        return [...currentEffects, ...effects]
    }

    static deleteByName(effects: Effect[], name: string) {
        return this._delete(
            effects,
            e => e.name == name
        )
    }

    static deleteByNameAndTarget(effects: Effect[], name: string, target: number) {
        return this._delete(
            effects,
            e => e.name == name && e.target == target
        )
    }

    // TODO
}