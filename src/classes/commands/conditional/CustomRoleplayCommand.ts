import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CUSTOM_ROLEPLAY_SETTING_ID } from '../../../utils/values/consts'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'
import { MessageContext } from '../../../utils/values/types/contexts'
import { MaybeString } from '../../../utils/values/types/types'
import RoleplaysService from '../../db/services/rp/RoleplaysService'
import CommandAccessService from '../../db/services/settings/access/CommandAccessService'
import ConditionalCommand from '../base/ConditionalCommand'

export default class CustomRoleplayCommand extends ConditionalCommand {
    protected async _condition({ chatId, strings: [_first, command] }: ConditionalCommandOptions): Promise<boolean> {
        return Boolean(await this._getCommand(chatId, command))
    }

    protected async _getCommand(chatId: number, command: MaybeString) {
        const roleplayCommand = await RoleplaysService
            .getCommand(chatId, command?.toLowerCase() ?? '')

        return roleplayCommand
    }

    protected _getReply(ctx: MessageContext, dummyId: number) {
        const dummyFrom = {
            ...ctx.from,
            first_name: '',
            id: dummyId
        }

        const reply = 'reply_to_message' in ctx.message ?
            ctx.message.reply_to_message?.from ?? dummyFrom :
            dummyFrom

        return reply
    }

    protected async _sendMessage({
        ctx,
        chatId,
        id,
        strings: [_first, command, other]
    }: ConditionalCommandOptions) {
        const roleplayCommand = await this._getCommand(
            chatId,
            command
        )
        if (!roleplayCommand) return false
        const [
            _rpName,
            text,
            rpCase
        ] = roleplayCommand

        const dummyId = 0
        const reply = this._getReply(ctx, dummyId)
        const hasReply = reply.id != dummyId && reply.id != ctx.botInfo.id

        const canUse = await CommandAccessService.canUse({
            chatId,
            id,
            command: {
                command,
            },
            settingId: CUSTOM_ROLEPLAY_SETTING_ID,
            ctx
        })
        if (!canUse) return true

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/other/rp.pug',
            {
                changeValues: {
                    text,
                    user: await ContextUtils.getUser(
                        chatId,
                        id,
                    ),
                    reply: await ContextUtils.getUser(
                        chatId,
                        reply.id,
                    ),
                    hasReply,
                    other,
                    rpCase
                }
            }
        )
        return true
    }

    protected async _execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        return await this._sendMessage(options)
    }
}