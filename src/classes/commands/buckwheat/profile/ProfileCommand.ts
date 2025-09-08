import { MILLISECONDS_IN_DAY } from './../../../../utils/values/consts';
import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserProfileService from '../../../db/services/user/UserProfileService'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
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
import UserLeftService from '../../../db/services/user/UserLeftService'
import Logging from '../../../../utils/Logging'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'

export default class ProfileCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'профиль'
        this._description = 'я показываю профиль\nесли скинуть изображение, то поменяю вашу аватарку'
        this._replySupport = true
        this._needData = true
        this._argumentText = 'ник'
        this._aliases = ['кто']
    }

    private async _getPhotoId(ctx: TextContext, id: number): Promise<string | null> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return null

        let photoId: string = await UserImageService.get(chatId, id)
        if(photoId.length) {
            return photoId
        }
        
        try {
            if(id != 0) {
                let profilePhotos = await ctx
                    .telegram
                    .getUserProfilePhotos(id, 0, 1)


                return profilePhotos.total_count > 0 ? 
                    profilePhotos.photos[0][0].file_id : 
                    null
            }

            else {
                throw 'no profile photos'
            }
        }
        catch {
            return null
        }
    }

    private async _getIdAndName(ctx: TextContext, other: MaybeString): Promise<{id: number, name: string} | null> {
        let id: number
        let name: string

        if(other) {
            const chatId = await LinkedChatService.getChatId(ctx)
            if(!chatId) return null
            const user = await UserProfileService.findByName(chatId, other)

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
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return

        const user = await UserProfileService.create(chatId, id, name)
        const photoId = await this._getPhotoId(ctx, id)
        
        const rank = user.rank ?? RankUtils.min
        const classType = user.className ?? ClassUtils.defaultClassName
        const experience = await ExperienceService.get(chatId, id)

        const messages = await MessagesService.get(chatId, id)
        const afterFirstMessage = Date.now() - (messages.firstMessage ?? 0)

        const isLinked = (await LinkedChatService.get(id)) == ctx.chat.id
        const isLeft = await UserLeftService.get(chatId, id)

        const path = 'text/commands/profile/profile.pug'
        const changeValues = {
            rank,
            isLeft,
            isLinked,
            maxLevel: LevelUtils.max,
            level: LevelUtils.get(experience),
            ...await ContextUtils.getUser(chatId, id),
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

        try {
            if(photoId) {
                const messageText = await FileUtils.readPugFromResource(
                    path,
                    {changeValues}
                )

                const isSend = await MessageUtils.answerPhoto(
                    ctx,
                    messageText,
                    photoId
                )

                if(!isSend) {
                    throw 'cant send photo'
                }
            }
            else {
                throw 'no photo id'
            }
        }
        catch(e) {
            Logging.warn(e)
            await MessageUtils.answerMessageFromResource(
                ctx,
                path,
                {changeValues}
            )
        }
    }

}