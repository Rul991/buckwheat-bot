import { FIRST_INDEX } from './../../../../utils/values/consts';
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
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
import Logging from '../../../../utils/Logging'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import MarriageService from '../../../db/services/marriage/MarriageService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import RankSettingsService from '../../../db/services/settings/RankSettingsService';
import UserSettingsService from '../../../db/services/settings/UserSettingsService'

type IdAndName = {
    id: number
    name: string
}

export default class ProfileCommand extends BuckwheatCommand {
    protected _settingId: string = 'profile'

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
        const chatId = await LinkedChatService.getCurrent(ctx)
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
                    profilePhotos.photos[FIRST_INDEX][FIRST_INDEX].file_id : 
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

    private async _getIdAndName({ctx, other, replyFrom}: BuckwheatCommandOptions): Promise<IdAndName | null> {
        let id: number
        let name: string

        if(other) {
            const chatId = await LinkedChatService.getCurrent(ctx)
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
        else if(replyFrom) {
            const {id: replyId, first_name} = replyFrom

            id = replyId
            name = first_name
        }
        else {
            id = ctx.from.id
            name = ctx.from.first_name
        }

        return {id, name}
    }

    private async _getFamily(chatId: number, id: number) {
        const marriage = await MarriageService.get(chatId, id)
        const {
            partnerId,
            startedAt
        } = marriage

        if(!partnerId) {
            return null
        }

        const partner = await ContextUtils.getUser(chatId, partnerId)
        const elapsed = TimeUtils.getElapsed(startedAt ?? Date.now())
        const date = TimeUtils.formatMillisecondsToTime(elapsed)

        return {
            partner,
            date
        }
    }

    private async _getLeft(ctx: TextContext, id: number) {
        if(ctx.chat.type == 'private') return false
        return await ContextUtils.isLeft(ctx, id)
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const { ctx, other, chatId } = options
        let idAndName = await this._getIdAndName(options)

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
        const user = await UserProfileService.create(chatId, id, name)
        const photoId = await this._getPhotoId(ctx, id)
        
        const rank = user.rank ?? RankUtils.min
        const rankName = await RankSettingsService.get<'string'>(chatId, `rank-${rank}`)
        const summonEmoji = await UserSettingsService.get<'enum'>(id, 'summonEmoji')

        const classType = user.className ?? ClassUtils.defaultClassName
        const experience = await ExperienceService.get(chatId, id)

        const messages = await MessagesService.get(chatId, id)
        const afterFirstMessage = TimeUtils.getElapsed(messages.firstMessage ?? 0)

        const isLinked = (await LinkedChatService.getRaw(id)) == ctx.chat.id
        const isLeft = await this._getLeft(ctx, id)
        const family = await this._getFamily(chatId, id)

        const path = 'text/commands/profile/profile.pug'
        const changeValues = {
            rank,
            isLeft,
            family,
            isLinked,
            summonEmoji,
            userNameRank: rankName,
            maxLevel: LevelUtils.max,
            level: LevelUtils.get(experience),
            emoji: RankUtils.getEmojiByRank(rank),
            ...await ContextUtils.getUser(chatId, id),
            className: ClassUtils.getName(classType),
            classEmoji: ClassUtils.getEmoji(classType),
            status: RankUtils.getAdminStatusByNumber(rank, id),
            description: user.description?.toUpperCase() || '...',
            spawnDate: TimeUtils.formatMillisecondsToTime(afterFirstMessage),
            messages: StringUtils.toFormattedNumber(messages.total ?? 0),
            experiencePrecents: ExperienceUtils.precents(experience)
        }

        const inlineKeyboard =  await LegacyInlineKeyboardManager.get(
            'profile/profile', 
            {
                id
            }
        )

        try {
            if(photoId) {
                const messageText = await FileUtils.readPugFromResource(
                    path,
                    {changeValues}
                )

                const isSend = await MessageUtils.answerPhoto(
                    ctx,
                    messageText,
                    photoId,
                    {inlineKeyboard}
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
                {changeValues, inlineKeyboard}
            )
        }
    }

}