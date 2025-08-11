import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserProfileService from '../../../db/services/user/UserProfileService'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
import { DEFAULT_USER_NAME, EMPTY_PROFILE_IMAGE as EMPTY_PROFILE_IMAGE_ID, PARSE_MODE } from '../../../../utils/consts'
import RankUtils from '../../../../utils/RankUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import MessageUtils from '../../../../utils/MessageUtils'

export default class ProfileCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'профиль'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        let id: number
        let name: string

        if('reply_to_message' in ctx.message!) {
            const {id: replyId, first_name} = ctx.message.reply_to_message?.from!

            id = replyId
            name = first_name
        }
        else if(ctx.from) {
            id = ctx.from.id
            name = ctx.from.first_name
        }
        else return

        let user = await UserProfileService.get(id)
        
        if(!user) {
            user = await UserProfileService.create(
                id, 
                name
            )
        }

        let profilePhotos = await ctx.telegram.getUserProfilePhotos(id, 0, 1)
        let photoId: string

        
        const rank = user?.rank ?? -1
        const devStatus = RankUtils.getDevStatusByNumber(rank)
        
        const path = 'text/commands/profile.html'
        const changeValues = {
            name: user?.name || DEFAULT_USER_NAME,
            link: ContextUtils.getLinkUrl(user?.id ?? 0),
            rank: rank.toString(),
            emoji: RankUtils.getEmojiByRank(rank),
            userNameRank: RankUtils.getRankByNumber(rank),
            devStatus,
            description: user?.description?.toUpperCase() || '...'
        }

        if(profilePhotos.total_count > 0) {
            photoId = profilePhotos.photos[0][0].file_id
        }
        else if(EMPTY_PROFILE_IMAGE_ID) {
            photoId = EMPTY_PROFILE_IMAGE_ID 
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                path,
                {changeValues}
            )

            return
        }

        const messageText = await FileUtils.readTextFromResource(
            path,
            {changeValues}
        )

        await ctx.replyWithPhoto(photoId, {
            caption: messageText,
            parse_mode: PARSE_MODE
        })
    }

}