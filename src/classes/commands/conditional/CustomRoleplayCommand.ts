import MessageUtils from '../../../utils/MessageUtils'
import RoleplayUtils from '../../../utils/RoleplayUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import { CommandStrings, MaybeString } from '../../../utils/values/types/types'
import { TextContext } from '../../../utils/values/types/contexts'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import RoleplaysService from '../../db/services/rp/RoleplaysService'
import ConditionalCommand from '../base/ConditionalCommand'

export default class CustomRoleplayCommand extends ConditionalCommand {
    private _text: string | null = null

    async condition(ctx: TextContext, [_word, command, _other]: CommandStrings): Promise<boolean> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return false

        const roleplayCommand = await RoleplaysService
            .getCommand(chatId, command?.toLowerCase() ?? '')
        
        if(roleplayCommand) {
            this._text = roleplayCommand[1]
        }

        return Boolean(roleplayCommand)
    }

    async execute({ ctx, other }: BuckwheatCommandOptions): Promise<void> {
        if(!this._text) return
        
        await MessageUtils.answer(
            ctx,
            await RoleplayUtils.getMessage(ctx, this._text, other)
        )
    }
}