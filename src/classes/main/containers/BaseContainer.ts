import { AsyncOrSync } from '../../../utils/values/types/types'
import BaseAction from '../../actions/base/BaseAction'

export default abstract class<C, A extends BaseAction, K extends keyof any> {
    protected abstract _container: C

    protected abstract _getKey(action: A, i: number): K
    abstract add(...actions: A[]): void
    abstract getByKey(key: K): A | undefined
    abstract insert(key: K, action: A): void
    abstract [Symbol.iterator](): IterableIterator<A>
    
    async forEach(cb: (action: A, key: K) => AsyncOrSync<boolean | void>): Promise<void> {
        let i = 0
        for (const action of this) {
            await cb(action, this._getKey(action, i))
            i++
        }
    }
}