import { Context } from 'telegraf'
import EveryMessageAction from './EveryMessageAction'
import UserProfileService from '../../db/services/user/UserProfileService'
import Logging from '../../../utils/Logging'

export default class CreateProfileAction extends EveryMessageAction {
    async execute(ctx: Context): Promise<void> {
        if(!ctx.from) return

        const {id, first_name} = ctx.from

        const user = await UserProfileService.create(id, first_name)
        if(!user) {
            Logging.warn(`profile(id: ${id}) exist`)
        }
        else {
            Logging.log(`created new profile: ${id}`)
        }
    }

}