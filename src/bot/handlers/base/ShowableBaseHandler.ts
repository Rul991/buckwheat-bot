import type { CommandType } from "../../../protos/commands_pb"
import CommandDescriptionUtils from "../../../utils/command/CommandDescriptionUtils"
import type ShowableAction from "../../actions/base/ShowableAction"
import RankedHandler from "./RankedHandler"

export default abstract class ShowableBaseHandler<A extends ShowableAction<CommandType>> extends RankedHandler<A> {
    override add(...actions: A[]): this {
        for (const action of actions) {
            CommandDescriptionUtils.addByAction(action)

            for (const alias of action.aliases) {
                this._container.set(
                    alias,
                    action
                )
            }
        }
        return super.add(...actions)
    }
}