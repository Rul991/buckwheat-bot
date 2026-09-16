import type { CommandType } from "../protos/commands_pb"
import type { MaybeString } from "./types"

export type CommandStrings = [string, MaybeString, MaybeString]
export type CommandDescription = {
    name: string
    aliases: string[]
    description: string,
    needData: boolean,
    isSupportReply: boolean,
    argumentText: string,
    type: CommandType
    isShow: boolean
    settingId: number
}