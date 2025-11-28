import { Context, Telegraf } from 'telegraf'
import BaseAction from '../../actions/base/BaseAction'
import { AsyncOrSync, MyTelegraf, SceneContextData } from '../../../utils/values/types/types'

export default abstract class BaseHandler<
    T extends InstanceType<N>, 
    C extends Array<T> | Record<string, T>, 
    N extends typeof BaseAction = typeof BaseAction
> {
    protected _container: C
    protected _needType: N

    constructor(container: C, needType: N) {
        this._container = container
        this._needType = needType
    }
    
    add(...values: T[]): void {
        for (const value of values) {
            this._add(value)
        }
    }

    isNeedType(action: BaseAction): boolean {
        return action instanceof this._needType
    }

    protected _add(value: T): void {
        if(this._container instanceof Array) {
            this._container.push(value)
        }
        else {
            this._container[value.name] = value
        }
    }

    abstract setup(bot: MyTelegraf): AsyncOrSync
}