import type { MyBot } from "../../../types/bot"
import type BaseAction from "../../actions/base/BaseAction"

export default abstract class BaseHandler<Action extends BaseAction> {
    protected _container: Map<string, Action>

    constructor() {
        this._container = new Map()
    }

    add(...actions: Action[]) {
        for (const action of actions) {
            this._container.set(
                action.name,
                action
            )
        }

        return this
    }

    abstract setup(bot: MyBot): Promise<void>
}