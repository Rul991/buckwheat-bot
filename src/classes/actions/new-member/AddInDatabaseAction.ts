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

export default class AddInDatabaseAction extends NewMemberAction {
    private async _updateIfBot(ctx: NewMemberContext, from: User): Promise<void> {
        if(!(from.is_bot && from.id != ctx.botInfo.id)) return

        await Promise.allSettled(
            [
                UserClassService.update(from.id, 'bot')
            ]
        )
    }

    private async _addInDatabase(ctx: NewMemberContext, from: User): Promise<void> {
        const {id, first_name} = from

        await Promise.allSettled([
            UserProfileService.create(id, first_name),
            CasinoAccountService.create(id),
            WorkService.get(id),
            ItemsService.get(id),
            MessagesService.get(id),
            UserClassService.get(id),
            LevelService.get(id),
            UserLeftService.update(id, false)
        ])

        await this._updateIfBot(ctx, from)
    }

    async execute(ctx: NewMemberContext): Promise<void> {
        for await(const from of ctx.message.new_chat_members) {
            await this._addInDatabase(ctx, from)
        }
    }
}