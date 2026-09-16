import { MAX_NAME_LENGTH } from "../../../../../consts/lengths"
import AvaHistory from "../../../../../db/entities/user/AvaHistory"
import User from "../../../../../db/entities/user/User"
import LinkedChatService from "../../../../../db/services/chat/LinkedChatService"
import LevelService from "../../../../../db/services/level/LevelService"
import MessagesService from "../../../../../db/services/message/MessagesService"
import SettingValueService from "../../../../../db/services/settings/SettingValueService"
import UserAvaService from "../../../../../db/services/user/UserAvaService"
import UserService from "../../../../../db/services/user/UserService"
import { summonEmojiSetting } from "../../../../../resources/settings/user"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BotContext } from "../../../../../types/bot"
import type { MessageTextContext } from "../../../../../types/contexts"
import type { ReplyOptions } from "../../../../../types/options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ContextUtils from "../../../../../utils/bot/ContextUtils"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import ClassUtils from "../../../../../utils/db/ClassUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import ExperienceUtils from "../../../../../utils/level/ExperienceUtils"
import LevelUtils from "../../../../../utils/level/LevelUtils"
import Logger from "../../../../../utils/logs/Logger"
import TimeUtils from "../../../../../utils/time/TimeUtils"
import { profileKeyboard } from "../../../../keyboards/user"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

type GetUserResult =
    & {
        user?: User
    }
    & (
        | {
            type: 'id'
            value: number
        }
        | {
            type: 'name' | 'username'
            value: string
        }
    )

type ReplyMediaOptions = {
    key: string
    ava: AvaHistory
    ctx: MessageTextContext
    messageOptions: ReplyOptions
}

export default class ProfileCommand extends BuckwheatCommand {
    override aliases: string[] = ['кто', 'who', 'ху']
    override name: string = 'профиль'
    override filename: string = 'profile'
    override minimumRank: number = 0
    override isSupportReply: boolean = true
    override needData: boolean = true
    override settingId: number = 17

    private async _getUser(options: BuckwheatCommandOptions): Promise<GetUserResult> {
        const {
            chatId,
            other,
            replyFrom,
            ctx,
            id: myId
        } = options

        if (other) {
            if (other.startsWith('@')) {
                const username = other.slice(1).split(' ')[0]!
                return {
                    user: await UserService.getByUsername(chatId, username),
                    type: 'username',
                    value: `@${username}`
                }
            }

            const name = other.slice(0, MAX_NAME_LENGTH)
            return {
                user: await UserService.getByName(chatId, name),
                type: 'name',
                value: name
            }
        }

        if (!replyFrom) {
            return {
                user: ctx.vars.user,
                type: 'id',
                value: myId
            }
        }

        const id = replyFrom.id
        return {
            user: await UserService.defaultCreate(
                chatId,
                id,
                replyFrom
            ),
            type: 'id',
            value: id
        }
    }

    private async _updateCurrentAvaByProfilePhoto(ctx: BotContext, user: User): Promise<AvaHistory | undefined> {
        const id = user.id
        const chatId = user.chatId

        const fileId = await ContextUtils.getUserProfilePhoto(ctx, id)
        if (!fileId) return undefined

        const avaHistory = new AvaHistory({
            fileId
        })

        await UserAvaService.set(chatId, id, avaHistory)
        return avaHistory
    }

    private async _getAva(options: BuckwheatCommandOptions, user: User): Promise<AvaHistory | undefined> {
        const {
            ctx,
        } = options

        if (user.currentAva) {
            return user.currentAva
        }

        return await this._updateCurrentAvaByProfilePhoto(ctx, user)
    }

    private async _getLevelVars(options: BuckwheatCommandOptions, user: User) {
        const {
            ctx,
            chatId,
        } = options

        const level = user.id == ctx.vars.user?.id
            ? ctx.vars.level :
            await LevelService.get(chatId, user.id)

        const currentExperience = level?.currentExperience ?? ExperienceUtils.min
        const currentLevel = LevelUtils.get(currentExperience)

        const max = LevelUtils.max
        const precents = ExperienceUtils.precents(currentExperience)

        return {
            current: currentLevel,
            max,
            precents,
        }
    }

    private async _replyMedia({
        ctx,
        key,
        ava,
        messageOptions
    }: ReplyMediaOptions): Promise<void> {
        const fileId = ava.fileId
        const type = ava.type
        const replyOptions = {
            ...messageOptions,
            key
        }

        if (type == 'image') {
            await MessageUtils.replyPhoto(
                ctx,
                fileId,
                replyOptions
            )
        }
        else if (type == 'video') {
            await MessageUtils.replyVideo(
                ctx,
                fileId,
                replyOptions
            )
        }
        else if (type == 'animation') {
            await MessageUtils.replyGif(
                ctx,
                fileId,
                replyOptions
            )
        }
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
        } = options

        const {
            user,
            type,
            value
        } = await this._getUser(options)
        if (!user) {
            return {
                key: 'profile/no',
                options: {
                    vars: {
                        value,
                        type
                    }
                }
            }
        }

        const id = user.id
        const ava = await this._getAva(options, user)

        const {
            rank,
            className,
        } = user

        const spawnDate = TimeUtils.getElapsed(+user.createdAt)
        const updateDate = TimeUtils.getElapsed(+user.updatedAt)

        const isLeft = await ContextUtils.hasStatus(
            ctx,
            ['kicked', 'left'],
            user.id,
        ) ?? true
        const isLinked = await LinkedChatService.isLinked(
            user.id,
            chatId
        )
        const summonEmojiSettingValue = await SettingValueService.get({
            setting: summonEmojiSetting,
            id: user.id
        })
        const summonEmoji = summonEmojiSettingValue.value
        
        const messages = await MessagesService.get(
            chatId,
            id,
        )

        const key = 'profile/profile'
        const messageOptions: ReplyOptions = {
            vars: {
                messages: messages.count,
                spawnDate: TimeUtils.formatMillisecondsToTime(ctx, spawnDate),
                updateDate: TimeUtils.formatMillisecondsToTime(ctx, updateDate),
                rank: {
                    ...await RankUtils.getVars(ctx, chatId, rank),
                    status: RankUtils.getStatusByRank(ctx, id, rank)
                },
                level: await this._getLevelVars(options, user),
                user: {
                    ...user,
                    linked: isLinked,
                    left: isLeft,
                    emoji: summonEmoji,
                },
                userClass: ClassUtils.getVars(ctx, className)
            },
            keyboard: await profileKeyboard(
                ctx,
                {
                    id: user.id
                }
            )
        }

        if (ava && ava.fileId) {
            await this._replyMedia({
                ctx,
                key,
                ava,
                messageOptions
            })
        }
        else {
            return {
                key,
                options: messageOptions
            }
        }

        Logger.debug('ProfileCommand', { ava })
    }
}