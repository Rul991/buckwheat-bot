import PhotoAction from '../../../actions/photo/PhotoAction'
import { MaybeString } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ShowableActionHandler from './ShowableActionHandler'
import { PhotoOptions } from '../../../../utils/values/types/action-options'
import { PhotoContext } from '../../../../utils/values/types/contexts'
import PremiumChatService from '../../../db/services/chat/PremiumChatService'

export default class PhotoHandler extends ShowableActionHandler<PhotoAction, 'photo'> {
    protected _hasntPremiumAction?: PhotoAction | undefined
    protected _notExistAction?: PhotoAction | undefined
    protected _nonCommandAction?: PhotoAction | undefined
    protected _filterName: 'photo' = 'photo'

    protected async _hasPremium(options: PhotoOptions): Promise<boolean> {
        const {
            chatId
        } = options

        return await PremiumChatService.isPremium(chatId)
    }

    protected async _createOptions(ctx: PhotoContext, other: MaybeString): Promise<PhotoOptions | null> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return null

        return {
            id,
            chatId,
            other,
            ctx
        }
    }

    protected _getText(ctx: PhotoContext): string | undefined {
        return ctx.message.caption
    }
}