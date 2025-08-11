import { Context } from 'telegraf'

export default abstract class BaseAction {
    protected _name: string

    constructor() {
        this._name = ''
    }

    get name(): string {
        return this._name
    }

    abstract execute(ctx: Context, ...args: any[]): Promise<any>
}