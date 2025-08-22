import MessageUtils from '../../../utils/MessageUtils'
import RoleplayUtils from '../../../utils/RoleplayUtils'
import { TextContext, CommandStrings, MaybeString } from '../../../utils/values/types'
import RoleplaysService from '../../db/services/rp/RoleplaysService'
import ConditionalCommand from '../base/ConditionalCommand'

export default class CustomRoleplayCommand extends ConditionalCommand {
    private _text: string | null = null

    async condition(ctx: TextContext, [_word, command, _other]: CommandStrings): Promise<boolean> {
        const roleplayCommand = await RoleplaysService
            .getCommand(ctx.chat.id, command ?? '')
        
        if(roleplayCommand) {
            this._text = roleplayCommand[1]
        }

        return Boolean(roleplayCommand)
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(!this._text) return
        
        await MessageUtils.answer(
            ctx,
            await RoleplayUtils.getMessage(ctx, this._text)
        )
    }
}