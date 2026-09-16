import type { ChatFullInfo, ChatMember, StickerSet } from "grammy/types"
import type { BotContext } from "../../types/bot"
import ExceptionUtils from "../exceptions/ExceptionUtils"
import type { Reactions } from "../../types/types"
import Logger from "../logs/Logger"
import TimeUtils from "../time/TimeUtils"
import { CHAT_MEMBER_CACHE_TIME } from "../../consts/time"

type ChatMemberCache = {
    createdAt: number
    chatMember: ChatMember
}

export default class ContextUtils {
    private static _chatMembersCache: Map<string, ChatMemberCache> = new Map()

    private static _getChatMemberFromCache(key: string): ChatMember | undefined {
        const chatMemberCache = this._chatMembersCache.get(key)
        if (!chatMemberCache) return undefined

        if (TimeUtils.isExpired(chatMemberCache.createdAt, CHAT_MEMBER_CACHE_TIME)) {
            this._chatMembersCache.delete(key)
            return undefined
        }

        return chatMemberCache.chatMember
    }

    static async getChatMember(ctx: BotContext, id?: number): Promise<ChatMember | undefined> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const chatId = ctx.chatId
                const userId = id || ctx.from?.id
                if (!userId) throw new Error('no userId in ContextUtils.getChatMember')

                const key = `${chatId}:${userId}`
                const cachedChatMember = this._getChatMemberFromCache(key)
                if (cachedChatMember) {
                    return cachedChatMember
                }

                const newChatMember = await ctx.getChatMember(userId)
                this._chatMembersCache.set(key, { createdAt: Date.now(), chatMember: newChatMember })

                return newChatMember
            }
        )
    }

    static hasStatusByChatMember(chatMember: ChatMember | undefined, statuses: ChatMember['status'][]): boolean | undefined {
        if (!chatMember) return undefined
        if (!statuses.length) return true

        for (const status of statuses) {
            if (status == chatMember.status) {
                return true
            }
        }

        return false
    }

    static async hasStatus(ctx: BotContext, statuses: ChatMember['status'][], id?: number): Promise<boolean | undefined> {
        if (!statuses.length) return true

        const chatMember = await this.getChatMember(ctx, id)
        return this.hasStatusByChatMember(chatMember, statuses)
    }

    static async isCreator(ctx: BotContext, id?: number): Promise<boolean> {
        return await this.hasStatus(
            ctx,
            ['creator'],
            id
        ) ?? false
    }

    static async react(ctx: BotContext, reaction: Reactions, messageId?: number): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                if(messageId) {
                    if(!ctx.chatId) return false
                    return await ctx.api.setMessageReaction(
                        ctx.chatId,
                        messageId,
                        [
                            {
                                type: 'emoji',
                                emoji: reaction
                            }
                        ]
                    )
                }

                return await ctx.react(
                    reaction,
                )
            },
            false
        )
    }

    static async getUserProfilePhoto(ctx: BotContext, id?: number): Promise<string | undefined> {
        const options = {
            limit: 1
        }
        return await ExceptionUtils.handleAsync(
            async () => {
                const userProfilePhotos = id ?
                    await ctx.api.getUserProfilePhotos(
                        id,
                        options
                    ) :
                    await ctx.getUserProfilePhotos(options)

                const {
                    photos
                } = userProfilePhotos

                Logger.debug('ContextUtils.getUserProfilePhoto', userProfilePhotos)
                const photoSizes = photos[0] ?? []
                const photo = photoSizes[photoSizes.length - 1]

                return photo?.file_id
            },
        )
    }

    static async getChat(ctx: BotContext, chatId?: number): Promise<ChatFullInfo | undefined> {
        return await ExceptionUtils.handleAsync(
            async () => {
                if (chatId) {
                    return await ctx.api.getChat(
                        chatId
                    )
                }
                else {
                    return await ctx.getChat()
                }
            },
            undefined
        )
    }

    static async getStickerPack(
        ctx: BotContext,
        name: string
    ): Promise<StickerSet | undefined> {
        return await ExceptionUtils.handleAsync(
            async () => {
                return await ctx.api.getStickerSet(
                    name
                )
            }
        )
    }
}