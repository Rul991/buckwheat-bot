import BaseAction from '../../actions/base/BaseAction'
import { AsyncOrSync, MyTelegraf } from '../../../utils/values/types/types'
import BaseContainer from '../containers/BaseContainer'

export default abstract class BaseHandler<
    T extends BaseAction, 
    C extends BaseContainer<any, any, any> 
> {
    protected _container: C

    constructor(container: C) {
        this._container = container
    }
    
    add(...values: T[]): void {
        for (const value of values) {
            this._add(value)
        }
    }

    protected _add(value: T): void {
        this._container.add(value)
    }

    abstract setup(bot: MyTelegraf): AsyncOrSync
}