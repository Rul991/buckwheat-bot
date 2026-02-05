import { DUEL_PRICE_PER_LEVEL } from '../values/consts'

export default class {
    static getPrice(level: number) {
        return level * DUEL_PRICE_PER_LEVEL
    }
}