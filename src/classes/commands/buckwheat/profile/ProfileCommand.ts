import { MILLISECONDS_IN_DAY } from './../../../../utils/values/consts';
import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserProfileService from '../../../db/services/user/UserProfileService'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
import { EMPTY_PROFILE_IMAGE as EMPTY_PROFILE_IMAGE_ID, PARSE_MODE } from '../../../../utils/values/consts'
import RankUtils from '../../../../utils/RankUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import UserImageService from '../../../db/services/user/UserImageService'
import ClassUtils from '../../../../utils/ClassUtils'
import MessagesService from '../../../db/services/messages/MessagesService'
import LevelUtils from '../../../../utils/level/LevelUtils'
import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import ExperienceService from '../../../db/services/level/ExperienceService'
import StringUtils from '../../../../utils/StringUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import UserLinkedService from '../../../db/services/user/UserLinkedService'

export default class ProfileCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'профиль'
        this._description = 'я показываю профиль\nесли скинуть изображение, то поменяю вашу аватарку'
        this._replySupport = true
        this._needData = true
        this._argumentText = 'ник'
    }

    private async _getPhotoId(ctx: TextContext, id: number): Promise<string | null> {
        let photoId: string = await UserImageService.get(id)
        if(photoId.length) {
            return photoId
        }
        

        if(id != 0) {
            let profilePhotos = await ctx
                .telegram
                .getUserProfilePhotos(id, 0, 1)

            return profilePhotos.total_count > 0 ? 
                profilePhotos.photos[0][0].file_id : 
                EMPTY_PROFILE_IMAGE_ID ?? null
        }

        else {
            return null
        }
    }

    private async _getIdAndName(ctx: TextContext, other: MaybeString): Promise<{id: number, name: string} | null> {
        let id: number
        let name: string

        if(other) {
            const user = await UserProfileService.findByName(other)

            if(!user) {
                return null
            }

            else {
                id = user.id
                name = user.name
            }
        }
        else if('reply_to_message' in ctx.message!) {
            const {id: replyId, first_name} = ctx.message.reply_to_message?.from!

            id = replyId
            name = first_name
        }
        else {
            id = ctx.from.id
            name = ctx.from.first_name
        }

        return {id, name}
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        let idAndName = await this._getIdAndName(ctx, other)

        if(!idAndName) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/profile/no-user.pug',
                {
                    changeValues: {
                        name: other
                    }
                }
            )
            return
        }

        const {id, name} = idAndName
        const user = await UserProfileService.create(id, name)
        const photoId = await this._getPhotoId(ctx, id)
        
        const rank = user.rank ?? RankUtils.min
        const classType = user.className ?? ClassUtils.defaultClassName
        const experience = await ExperienceService.get(id)

        const messages = await MessagesService.get(id)
        const afterFirstMessage = Date.now() - (messages.firstMessage ?? 0)
        const isLinked = (await UserLinkedService.get(id)) == ctx.chat.id

        const path = 'text/commands/profile/profile.pug'
        const changeValues = {
            rank,
            maxLevel: LevelUtils.max,
            isLinked,
            level: LevelUtils.get(experience),
            ...await ContextUtils.getUser(id),
            emoji: RankUtils.getEmojiByRank(rank),
            userNameRank: RankUtils.getRankByNumber(rank),
            className: ClassUtils.getName(classType),
            status: RankUtils.getAdminStatusByNumber(rank),
            classEmoji: ClassUtils.getEmoji(classType),
            description: user.description?.toUpperCase() || '...',
            spawnDate: afterFirstMessage >= MILLISECONDS_IN_DAY ? 
            TimeUtils.formatMillisecondsToTime(afterFirstMessage) :
            TimeUtils.toHHMMSS(afterFirstMessage),
            messages: StringUtils.toFormattedNumber(messages.total ?? 0),
            experiencePrecents: ExperienceUtils.precents(experience),
        }

        if(photoId) {
            const messageText = await FileUtils.readPugFromResource(
                path,
                {changeValues}
            )

            await ctx.replyWithPhoto(photoId, {
                caption: messageText,
                parse_mode: PARSE_MODE
            })
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                path,
                {changeValues}
            )
        }
    }

}