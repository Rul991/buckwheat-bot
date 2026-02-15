import { TelegramEmoji } from 'telegraf/types'
import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { ActionAccess } from '../../../../utils/values/types/command-access'
import BuckwheatCommand from '../../../commands/base/BuckwheatCommand'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'

export default class extends BuckwheatCommand {
    private readonly _reactions: TelegramEmoji[] = [
        '🤔',
        '🙊',
        '🤷',
        '🥱'
    ]
    protected _settingId: string = ''
    get actionAccesses(): ActionAccess[] {
        return []
    }

    async execute({ ctx, chatId }: BuckwheatCommandOptions): Promise<void> {
        const isSendReact = await ChatSettingsService.get<'boolean'>(
            chatId,
            'wrongCommandReact'
        )

        if (isSendReact) {
            const reaction = RandomUtils.choose(this._reactions)!
            await MessageUtils.react(
                ctx,
                reaction
            )
        }
        else {
            await MessageUtils.sendWrongCommandMessage(ctx)
        }
    }
}