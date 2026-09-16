import { CommandType } from "../../../protos/commands_pb"
import type { PhotoActionOptions } from "../../../types/action-options"
import type { PhotoActionExecuteResult } from "../../../types/results"
import ShowableAction from "./ShowableAction"

export default abstract class PhotoAction extends ShowableAction<CommandType.Photo> {
    override type: CommandType.Photo = CommandType.Photo
    abstract override execute(options: PhotoActionOptions): Promise<PhotoActionExecuteResult>
}