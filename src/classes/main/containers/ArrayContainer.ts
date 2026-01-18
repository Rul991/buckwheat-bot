import BaseAction from '../../actions/base/BaseAction'
import BaseContainer from './BaseContainer'

export default class <A extends BaseAction> extends BaseContainer<
    A[],
    A,
    number
> {
    protected _container: A[] = []

    protected _getKey(_: A, i: number): number {
        return i
    }

    add(...actions: A[]): void {
        this._container.push(...actions)
    }

    insert(key: number, action: A): void {
        this._container.splice(key, 0, action)
    }

    getByKey(key: number): A | undefined {
        return this._container[key]
    }

    *[Symbol.iterator](): IterableIterator<A> {
        for (const action of this._container) {
            yield action
        }
    }
}