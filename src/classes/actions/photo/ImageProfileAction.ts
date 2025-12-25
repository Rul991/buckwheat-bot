import MessageUtils from '../../../utils/MessageUtils'
import { FIRST_INDEX } from '../../../utils/values/consts'
import { PhotoOptions } from '../../../utils/values/types/action-options'
import UserImageService from '../../db/services/user/UserImageService'
import PhotoAction from './PhotoAction'

export default class ImageProfileAction extends PhotoAction {
    constructor () {
        super()
        this._name = 'профиль'
    }

    async execute({ ctx, chatId, id }: PhotoOptions): Promise<void> {
        const photoId = ctx.message.photo[FIRST_INDEX].file_id
        
        await UserImageService.update(
            chatId,
            id,
            photoId
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/profile/photo-profile.pug'
        )
    }
}