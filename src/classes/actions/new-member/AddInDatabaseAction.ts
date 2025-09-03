import { User } from 'telegraf/types'
import { NewMemberContext } from '../../../utils/values/types'
import NewMemberAction from './NewMemberAction'
import CasinoAccountService from '../../db/services/casino/CasinoAccountService'
import ItemsService from '../../db/services/items/ItemsService'
import MessagesService from '../../db/services/messages/MessagesService'
import UserProfileService from '../../db/services/user/UserProfileService'
import WorkService from '../../db/services/work/WorkService'
import UserClassService from '../../db/services/user/UserClassService'
import LevelService from '../../db/services/level/LevelService'
import UserLeftService from '../../db/services/user/UserLeftService'
import RankUtils from '../../../utils/RankUtils'
import UserDescriptionService from '../../db/services/user/UserDescriptionService'
import UserNameService from '../../db/services/user/UserNameService'
import UserRankService from '../../db/services/user/UserRankService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'

export default class AddInDatabaseAction extends NewMemberAction {
    private async _updateIfBot(ctx: NewMemberContext, from: User, chatId: number): Promise<void> {
        if(!from.is_bot) return
        if(from.id == ctx.botInfo.id) {
            this._updateIfBuckwheat(ctx, from, chatId)
            return
        }

        await Promise.allSettled(
            [
                UserClassService.update(chatId, from.id, 'bot')
            ]
        )
    }

    private async _updateIfBuckwheat(_: NewMemberContext, from: User, chatId: number): Promise<void> {
        const { id } = from

        const currentName = await UserNameService.get(chatId, id)
        const needName = 'Баквит'

        if (currentName === needName) return

        await UserNameService.update(chatId, id, needName)
        await UserDescriptionService.update(chatId, id, 'Я ваш проводник в данном чате')
        await UserRankService.update(chatId, id, RankUtils.admin)
        await UserClassService.update(chatId, id, 'boss')
    }

    private async _addInDatabase(ctx: NewMemberContext, from: User, chatId: number): Promise<void> {
        const {id, first_name} = from

        await Promise.allSettled([
            UserProfileService.create(chatId, id, await UserNameService.getUniqueName(chatId, first_name)),
            CasinoAccountService.create(chatId, id),
            WorkService.get(chatId, id),
            ItemsService.get(chatId, id),
            MessagesService.get(chatId, id),
            LevelService.get(chatId, id),
            UserLeftService.update(chatId, id, false),
            LinkedChatService.get(id)
        ])

        await this._updateIfBot(ctx, from, chatId)
    }

    async execute(ctx: NewMemberContext): Promise<void> {
        for await(const from of ctx.message.new_chat_members) {
            const chatId = await LinkedChatService.getChatId(ctx)
            if(!chatId) continue
            await this._addInDatabase(ctx, from, chatId)
        }
    }
}