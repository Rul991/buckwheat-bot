import MessageUtils from '../../../utils/MessageUtils'
import { PhotoContext, MaybeString } from '../../../utils/types'
import UserImageService from '../../db/services/user/UserImageService'
import PhotoAction from './PhotoAction'

export default class ImageProfileAction extends PhotoAction {
    constructor() {
        super()
        this._name = 'профиль'
    }

    async execute(ctx: PhotoContext, _: MaybeString): Promise<void> {
        await UserImageService.update(
            ctx.from.id, 
            ctx.message.photo[0].file_id
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/photo-profile.pug'
        )
    }
}