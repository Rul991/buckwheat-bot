import RankUtils from '../../../utils/RankUtils'

export default abstract class BaseAction {
    protected _name: string
    protected _minimumRank: number = RankUtils.min

    constructor() {
        this._name = ''
    }

    get name(): string {
        return this._name
    }

    get minimumRank(): number {
        return this._minimumRank
    }

    abstract execute(...args: any[]): Promise<any>
}