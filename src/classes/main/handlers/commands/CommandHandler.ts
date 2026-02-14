import Setting from '../../../../interfaces/other/Setting'
import SettingUtils from '../../../../utils/settings/SettingUtils'
import { COMMAND_ACCESS_TYPE, CUSTOM_ROLEPLAY_SETTING_ID, RANKS_LIST } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { TextContext } from '../../../../utils/values/types/contexts'
import { MaybeString } from '../../../../utils/values/types/types'
import NoCommand from '../../../actions/service/text/NoCommand'
import NoPremiumCommand from '../../../actions/service/text/NoPremiumCommand'
import WrongCommand from '../../../actions/service/text/WrongCommand'
import BuckwheatCommand from '../../../commands/base/BuckwheatCommand'
import PremiumChatService from '../../../db/services/chat/PremiumChatService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ShowableActionHandler from '../showable/ShowableActionHandler'

export default class CommandHandler extends ShowableActionHandler<BuckwheatCommand, 'text'> {
    protected _filterName: 'text' = 'text'
    protected _notExistAction?: BuckwheatCommand | undefined = new WrongCommand
    protected _nonCommandAction?: BuckwheatCommand | undefined = new NoCommand
    protected _hasntPremiumAction?: BuckwheatCommand | undefined = new NoPremiumCommand

    protected async _createOptions(ctx: TextContext, other: MaybeString): Promise<BuckwheatCommandOptions | null> {
        const userFrom = ctx.from
        const id = userFrom.id

        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return null

        const replyFrom = ctx.message.reply_to_message?.from
        const replyOrUserFrom = replyFrom ?? userFrom

        return {
            id,
            chatId,
            other,
            ctx,
            replyFrom,
            replyOrUserFrom
        }
    }

    protected _setupSettings(): void {
        super._setupSettings()

        const settings = {
            [CUSTOM_ROLEPLAY_SETTING_ID]: {
                title: 'РП-команды',
                description: 'Определяет ранг РП-команд',
                type: 'enum',
                properties: {
                    values: RANKS_LIST
                },
                default: 0
            }
        } as Record<string, Setting<'enum'>>
        SettingUtils.addSettings(COMMAND_ACCESS_TYPE, settings)
    }

    protected _getText(ctx: TextContext): string | undefined {
        return ctx.text
    }

    protected async _hasPremium(options: BuckwheatCommandOptions): Promise<boolean> {
        const {
            chatId,
        } = options

        return await PremiumChatService.isPremium(chatId)
    }
}