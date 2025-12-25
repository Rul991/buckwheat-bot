import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import ChatService from '../../../db/services/chat/ChatService'
import UserProfileService from '../../../db/services/user/UserProfileService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class StatsCommand extends BuckwheatCommand {
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
        const chats = await ChatService.getAll()
        const {uniqueUsers, users} = await UserProfileService.getStats()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/stats/stats.pug',
            {
                changeValues: {
                    chats: chats.length,
                    uniqueUsers: uniqueUsers.length,
                    users: users.length,
                }
            }
        )
    }
}