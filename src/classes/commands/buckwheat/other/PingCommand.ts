import { TelegramEmoji } from 'telegraf/types'
import MessageUtils from '../../../../utils/MessageUtils'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import UserSettingsService from '../../../db/services/settings/UserSettingsService'

export default class PingCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'прием'
        this._aliases = [
            'приём',
            'пинг'
        ]
        this._description = 'прием-прием'
    }

    async execute({ ctx, id }: BuckwheatCommandOptions): Promise<void> {
        const reactionChance = await UserSettingsService.get<'string'>(
            id, 
            'pingEmoji'
        ) ?? '🫡'

        await MessageUtils.react(ctx, reactionChance as TelegramEmoji)
    }
}