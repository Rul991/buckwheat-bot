import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { ActionAccess } from '../../../../utils/values/types/command-access'
import BuckwheatCommand from '../../../commands/base/BuckwheatCommand'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'

export default class extends BuckwheatCommand {
    protected _settingId: string = ''
    get actionAccesses(): ActionAccess[] {
        return []
    }
    
    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const isSendReact = await ChatSettingsService.get<'boolean'>(
            chatId,
            'wrongCommandReact'
        )

        if(isSendReact) {
            await MessageUtils.react(
                ctx,
                '🤔'
            )
        }
        else {
            await MessageUtils.sendWrongCommandMessage(ctx)
        }
    }
}