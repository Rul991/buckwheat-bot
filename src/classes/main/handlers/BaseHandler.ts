import { Telegraf } from 'telegraf'
import BaseAction from '../../actions/base/BaseAction'

export default abstract class BaseHandler<T extends BaseAction, K extends Array<T> | Record<string, T>> {
    protected _instances: K

    constructor(instances: K) {
        this._instances = instances
    }
    
    add(...values: T[]): void {
        for (const value of values) {
            this._add(value)
        }
    }

    protected _add(value: T): void {
        if(this._instances instanceof Array) {
            this._instances.push(value)
        }
        else {
            this._instances[value.name] = value
        }
    }

    abstract setup(bot: Telegraf): void
}