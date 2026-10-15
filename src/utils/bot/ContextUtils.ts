import type { ChatFullInfo, ChatMember, StickerSet } from "grammy/types"
import type { BotContext } from "../../types/bot"
import ExceptionUtils from "../exceptions/ExceptionUtils"
import type { Reactions } from "../../types/types"
import Logger from "../logs/Logger"
import { CHAT_LINK_EXPIRE_DATE, CHAT_MEMBER_CACHE_TIME } from "../../consts/time"
import TtlCache from "../cache/TtlCache"
import type { AnswerPreCheckoutQueryOptions } from "../../types/options"
import TimeUtils from "../time/TimeUtils"
import type { GrullyI18nVars } from "@grully/i18n"

type GetChatMemberOptions = {
    id?: number
    chatId?: number
}

type CreateInviteLinkOptions = {
    key?: string
    vars?: GrullyI18nVars
}

export default class ContextUtils {
    private static _chatMembersCache: TtlCache<string, ChatMember> = new TtlCache({
        ttl: CHAT_MEMBER_CACHE_TIME
    })

    private static _getChatMemberFromCache(key: string): ChatMember | undefined {
        return this._chatMembersCache.get(key)
    }

    static async getChatMember(ctx: BotContext, options: GetChatMemberOptions = {}): Promise<ChatMember | undefined> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const chatId = options.chatId || ctx.chatId
                const userId = options.id || ctx.from?.id
                if (!userId) throw new Error('no userId in ContextUtils.getChatMember')

                const key = `${chatId}:${userId}`
                const cachedChatMember = this._getChatMemberFromCache(key)
                if (cachedChatMember) {
                    return cachedChatMember
                }

                return await this._chatMembersCache.getOrSet(
                    key,
                    async () => {
                        if (!options.chatId) {
                            return await ctx.getChatMember(userId)
                        }
                        return await ctx.api.getChatMember(options.chatId, userId)
                    }
                )
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

    static async hasStatus(ctx: BotContext, statuses: ChatMember['status'][], options?: GetChatMemberOptions): Promise<boolean | undefined> {
        if (!statuses.length) return true

        const chatMember = await this.getChatMember(ctx, options)
        return this.hasStatusByChatMember(chatMember, statuses)
    }

    static async react(ctx: BotContext, reaction: Reactions, messageId?: number): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                if (messageId) {
                    if (!ctx.chatId) return false
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
                const chat = chatId ?
                    await ctx.api.getChat(
                        chatId,
                    ) :
                    await ctx.getChat()

                return chat
            },
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

    static async answerPreCheckoutQuery(
        ctx: BotContext,
        options: AnswerPreCheckoutQueryOptions
    ) {
        return await ExceptionUtils.handleAsync(
            async () => {
                return await ctx.answerPreCheckoutQuery(
                    options.ok,
                    options.key ?
                        {
                            error_message: ctx.t(
                                options.key,
                                options.vars
                            )
                        } :
                        undefined
                )
            }
        )
    }

    static async approveChatJoinRequest(
        ctx: BotContext,
        id: number
    ): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                return await ctx.approveChatJoinRequest(id)
            },
            false
        )
    }

    static async declineChatJoinRequest(
        ctx: BotContext,
        id: number
    ): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                return await ctx.declineChatJoinRequest(id)
            },
            false
        )
    }

    static async createInviteLink(ctx: BotContext, chatId: number, options: CreateInviteLinkOptions = {}) {
        return await ExceptionUtils.handleAsync(
            async () => {
                const {
                    key,
                    vars
                } = options
                const name = key ?
                    ctx.t(
                        key,
                        vars
                    ) :
                    undefined

                return ctx.api.createChatInviteLink(
                    chatId,
                    {
                        creates_join_request: true,
                        expire_date: TimeUtils.getUntilDateInSeconds(CHAT_LINK_EXPIRE_DATE),
                        name,
                    }
                )
            }
        )
    }

    static async getFile(ctx: BotContext, fileId?: string) {
        return await ExceptionUtils.handleAsync(
            async () => {
                if(fileId) {
                    return ctx.api.getFile(fileId)
                }

                return ctx.getFile()
            }
        )
    }
}