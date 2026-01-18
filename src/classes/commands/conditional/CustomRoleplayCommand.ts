import MessageUtils from '../../../utils/MessageUtils'
import RoleplayUtils from '../../../utils/RoleplayUtils'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'
import RoleplaysService from '../../db/services/rp/RoleplaysService'
import ConditionalCommand from '../base/ConditionalCommand'

export default class CustomRoleplayCommand extends ConditionalCommand {
    protected _text?: string

    protected async _condition({ chatId, strings: [_first, command] }: ConditionalCommandOptions): Promise<boolean> {
        const roleplayCommand = await RoleplaysService
            .getCommand(chatId, command?.toLowerCase() ?? '')
        
        if(roleplayCommand) {
            this._text = roleplayCommand[1]
        }

        return Boolean(roleplayCommand)
    }

    protected async _execute({ ctx, strings: [_first, _command, other] }: ConditionalCommandOptions): Promise<void> {
        if(!this._text) return
        
        await MessageUtils.answer(
            ctx,
            await RoleplayUtils.getMessage(ctx, this._text, other)
        )
    }
}