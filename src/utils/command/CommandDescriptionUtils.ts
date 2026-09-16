import type ShowableAction from "../../bot/actions/base/ShowableAction"
import { CommandType } from "../../protos/commands_pb"
import type { BotContext } from "../../types/bot"
import type { CommandDescription } from "../../types/command"

export default class CommandDescriptionUtils {
    private static _descriptionsByTypes: Record<CommandType, Map<string, CommandDescription>> = {
        [CommandType.Photo]: new Map(),
        [CommandType.Text]: new Map(),
        [CommandType.Dice]: new Map(),
    }
    private static _descriptionArraysByTypes: Record<CommandType, Set<CommandDescription>> = {
        [CommandType.Text]: new Set(),
        [CommandType.Photo]: new Set(),
        [CommandType.Dice]: new Set(),
    }

    static types: CommandType[] = Object.keys(this._descriptionsByTypes).map(v => +v) as CommandType[]

    static has(description: CommandDescription): boolean {
        if (!description.isShow) return true
        const key = description.name
        const type = description.type

        return this._descriptionsByTypes[type].has(key)
    }

    static hasByName(name: string): boolean {
        return this.types.some(type => this._descriptionsByTypes[type].has(name))
    }

    static add(description: CommandDescription): void {
        if (!description.isShow) return
        if (this.has(description)) return

        const key = description.name
        const type = description.type

        this._descriptionsByTypes[type].set(
            key,
            description
        )
        this._descriptionArraysByTypes[type].add(description)
    }

    static addByAction(action: ShowableAction<CommandType>): void {
        const description = action.commandDescription
        CommandDescriptionUtils.add(description)
    }

    static getMap(type: CommandType): Map<string, CommandDescription> {
        return this._descriptionsByTypes[type]
    }

    static getArray(type: CommandType): CommandDescription[] {
        return this._descriptionArraysByTypes[type].values().toArray()
    }

    static getRendered(ctx: BotContext, commandDescription: CommandDescription): CommandDescription {
        const {
            description,
            argumentText,
            needData,
        } = commandDescription

        return {
            ...commandDescription,
            description: ctx.t(description),
            argumentText: needData ? ctx.t(argumentText) : ''
        }
    }
}