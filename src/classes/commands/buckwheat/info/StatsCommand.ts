import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatService from '../../../db/services/chat/ChatService'
import UserProfileService from '../../../db/services/user/UserProfileService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class StatsCommand extends BuckwheatCommand {
    protected _settingId: string = 'stats'

    constructor() {
        super()
        this._name = 'статы'
        this._description = 'показываю население энвелла и количество их бесед'
        this._aliases = [
            'статистика',
            'стата'
        ]
    }

    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        const {total, premiums} = await ChatService.getStats()
        const {uniqueUsers, users} = await UserProfileService.getStats()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/stats/stats.pug',
            {
                changeValues: {
                    chats: total,
                    premiums,
                    uniqueUsers: uniqueUsers.length,
                    users: users.length,
                }
            }
        )
    }
}