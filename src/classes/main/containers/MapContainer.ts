import BaseAction from '../../actions/base/BaseAction'
import BaseContainer from './BaseContainer'

export default class<A extends BaseAction> extends BaseContainer<
    Record<string, A>,
    A,
    string
> {
    protected _container: Record<string, A> = {}

    protected _getKey(action: A, i: number): string {
        return action.name
    }

    add(...actions: A[]): void {
        for (const action of actions) {
            this._container[action.name] = action
        }
    }

    insert(key: string, action: A): void {
        this._container[key] = action
    }

    getByKey(key: string): A | undefined {
        return this._container[key]
    }

    *[Symbol.iterator](): IterableIterator<A> {
        for (const key in this._container) {
            const action = this._container[key]
            yield action
        }
    }

    *entries() {
        for (const action of this) {
            yield [action.name, action] as const
        }
    }
}