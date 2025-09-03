import MessageUtils from '../../../utils/MessageUtils'
import { PhotoContext, MaybeString } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserImageService from '../../db/services/user/UserImageService'
import PhotoAction from './PhotoAction'

export default class ImageProfileAction extends PhotoAction {
    constructor() {
        super()
        this._name = 'профиль'
    }

    async execute(ctx: PhotoContext, _: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return
        
        await UserImageService.update(
            chatId,
            ctx.from.id, 
            ctx.message.photo[0].file_id
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/profile/photo-profile.pug'
        )
    }
}