import type { BuckwheatCommandOptions } from "../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../types/results"
import ShowableAction from "./ShowableAction"
import { CommandType } from "../../../protos/commands_pb"

export default abstract class BuckwheatCommand extends ShowableAction<CommandType.Text> {
    override type: CommandType.Text = CommandType.Text
    abstract override execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult>
}