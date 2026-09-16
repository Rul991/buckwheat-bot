import { CommandType } from "../../../protos/commands_pb"
import type { BuckwheatCommandOptions } from "../../../types/action-options"
import type { MessageTextContext } from "../../../types/contexts"
import type { ShowableActionGetOptions } from "../../../types/options"
import MessageUtils from "../../../utils/bot/MessageUtils"
import type BuckwheatCommand from "../../actions/base/BuckwheatCommand"
import NoCommandCommand from "../../actions/commands/buckwheat/default/NoCommandCommand"
import NotExistCommand from "../../actions/commands/buckwheat/default/NotExistCommand"
import ShowableActionHandler from "./ShowableActionHandler"

export default class BuckwheatCommandHandler extends ShowableActionHandler<BuckwheatCommand> {
    protected override _nonCommandAction?: BuckwheatCommand | undefined = new NoCommandCommand()
    protected override _notExistAction?: BuckwheatCommand | undefined = new NotExistCommand()

    constructor() {
        super(CommandType.Text)
    }

    protected override _getText(ctx: MessageTextContext): string {
        return ctx.msg.text
    }
    protected override _getOptions({
        chatId,
        id,
        ctx,
        commandStrings
    }: ShowableActionGetOptions<BuckwheatCommand>): BuckwheatCommandOptions {
        const [_firstName, _command, other] = commandStrings
        const replyFrom = ctx.msg.reply_to_message?.from
        const userFrom = ctx.from!
        const replyOrUserFrom = replyFrom ?? userFrom

        return {
            other,
            commandStrings,
            ctx,
            id,
            chatId,
            replyOrUserFrom,
            replyFrom
        }
    }
    protected override async _executeAction(action: BuckwheatCommand, options: BuckwheatCommandOptions): Promise<void> {
        const result = await action.execute(options)
        if(!result) return

        const {
            key,
            options: resultOptions
        } = result

        const {
            ctx
        } = options

        await MessageUtils.reply(
            ctx,
            key,
            resultOptions
        )
    }
}