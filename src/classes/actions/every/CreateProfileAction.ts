import { Context } from 'telegraf'
import EveryMessageAction from './EveryMessageAction'
import UserProfileService from '../../db/services/user/UserProfileService'
import CasinoAccountService from '../../db/services/casino/CasinoAccountService'
import { User } from 'telegraf/types'
import StringUtils from '../../../utils/StringUtils'

export default class CreateProfileAction extends EveryMessageAction {
    private async _createProfile(user?: User) {
        if(!user) return

        const {id, first_name} = user
        await UserProfileService.create(id, StringUtils.validate(first_name) || 'игрок')
        await CasinoAccountService.create(id)
    }

    async execute(ctx: Context): Promise<void> {
        if(!ctx.from) return
        await this._createProfile(ctx.from)

        if(ctx.message && 'reply_to_message' in ctx.message) {
            await this._createProfile(ctx.message.reply_to_message?.from)
        }
    }

}