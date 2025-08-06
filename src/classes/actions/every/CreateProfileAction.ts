import { Context } from 'telegraf'
import EveryMessageAction from './EveryMessageAction'
import UserProfileService from '../../db/services/user/UserProfileService'

export default class CreateProfileAction extends EveryMessageAction {
    async execute(ctx: Context): Promise<void> {
        if(!ctx.from) return

        const {id, first_name} = ctx.from

        const user = await UserProfileService.create(id, first_name)
        if(!user) {
            console.warn(`profile(id: ${id}) exist`)
        }
        else {
            console.log(`created new profile: ${id}`)
        }
    }

}