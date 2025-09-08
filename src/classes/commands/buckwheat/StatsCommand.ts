import MessageUtils from '../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../utils/values/types'
import ChatService from '../../db/services/chat/ChatService'
import UserProfileService from '../../db/services/user/UserProfileService'
import BuckwheatCommand from '../base/BuckwheatCommand'

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

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const chats = await ChatService.getAll()
        const uniqueUsers = await UserProfileService.getUniqueUsers()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/stats/stats.pug',
            {
                changeValues: {
                    chats: chats.length,
                    users: uniqueUsers.length
                }
            }
        )
    }
}