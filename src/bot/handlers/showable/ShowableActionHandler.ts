import type { FilterQuery } from "grammy"
import type { MyBot } from "../../../types/bot"
import type ShowableAction from "../../actions/base/ShowableAction"
import type { Contexts } from "../../../types/contexts"
import type { ShowableActionsOptions } from "../../../types/action-options"
import CommandUtils from "../../../utils/command/CommandUtils"
import type { ShowableActionGetOptions } from "../../../types/options"
import { CommandType } from "../../../protos/commands_pb"
import ShowableBaseHandler from "../base/ShowableBaseHandler"

export default abstract class ShowableActionHandler<A extends ShowableAction<CommandType>> extends ShowableBaseHandler<A> {
    private static _filterNames: Record<CommandType, FilterQuery> = {
        [CommandType.Photo]: 'msg:photo',
        [CommandType.Text]: 'msg:text',
        [CommandType.Dice]: 'msg:dice'
    }

    protected _notExistAction?: A
    protected _nonCommandAction?: A

    protected _type: A['type']

    constructor(type: A['type']) {
        super()
        this._type = type
    }

    protected abstract _getText(ctx: Contexts[A['type']]): string
    protected abstract _getOptions(options: ShowableActionGetOptions<A>): ShowableActionsOptions[A['type']]
    protected abstract _executeAction(action: A, options: ShowableActionsOptions[A['type']]): Promise<void>

    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            ShowableActionHandler._filterNames[this._type],
            async (ctx, next) => {
                if (ctx.msg?.forward_origin && !ctx.msg.is_automatic_forward) return

                const chatId = ctx.vars.chatId
                const id = ctx.vars.id
                if (!(chatId && id)) return

                const text = this._getText(ctx as any)
                const commandStrings = ctx.vars.commandStrings ?? CommandUtils.getCommandStrings(text)
                if (!commandStrings) return

                const [_, command] = commandStrings
                const options = this._getOptions({
                    ctx: ctx as any,
                    chatId,
                    id,
                    commandStrings
                })

                const action = command ?
                    this._container.get(command) ?? this._notExistAction :
                    this._nonCommandAction
                if (!action) return

                if (!await this._checkRank({ ctx, action, commandStrings })) return

                await this._executeAction(action, options)
                return next()
            }
        )
    }
}