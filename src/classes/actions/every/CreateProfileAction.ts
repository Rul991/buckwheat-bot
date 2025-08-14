import EveryMessageAction from './EveryMessageAction'
import UserProfileService from '../../db/services/user/UserProfileService'
import CasinoAccountService from '../../db/services/casino/CasinoAccountService'
import { User } from 'telegraf/types'
import StringUtils from '../../../utils/StringUtils'
import WorkService from '../../db/services/work/WorkService'
import { MessageContext } from '../../../utils/types'
import ItemsService from '../../db/services/items/ItemsService'
import MessagesService from '../../db/services/messages/MessagesService'

export default class CreateProfileAction extends EveryMessageAction {
    private async _createProfile(user?: User) {
        if(!user) return

        const {id, first_name} = user
        
        UserProfileService.create(id, StringUtils.validate(first_name) || 'игрок')
        CasinoAccountService.create(id)
        WorkService.get(id)
        ItemsService.get(id)
        MessagesService.get(id)
    }

    async execute(ctx: MessageContext): Promise<void> {
        if(!ctx.from) return
        await this._createProfile(ctx.from)

        if(ctx.message && 'reply_to_message' in ctx.message) {
            await this._createProfile(ctx.message.reply_to_message?.from)
        }
    }

}