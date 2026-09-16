import type { BotContext } from "../../types/bot"
import type { CopyMessageOptions, EditMediaOptions, ReplyMediaOptions, ReplyOptions, ReplyTextAsDocumentOptions } from "../../types/options"
import ExceptionUtils from "../exceptions/ExceptionUtils"
import type { Dices } from "../../types/types"
import Logger from "../logs/Logger"
import type { Message, MessageId } from "grammy/types"
import RandomUtils from "../math/RandomUtils"
import ContextUtils from "./ContextUtils"
import { InputFile, InputMediaBuilder } from "grammy"

type ReplyMediaType = keyof ReplyMessageResult

type MediaOptions<T extends ReplyMediaType> = {
    ctx: BotContext
    options: ReplyOptions
    type: T
    file: string
}

type ReplyMessageResult = {
    Photo: Message.PhotoMessage
    Video: Message.VideoMessage
    Animation: Message.AnimationMessage
    Document: Message.DocumentMessage
    Dice: Message.DiceMessage
    Sticker: Message.StickerMessage
}

export default class MessageUtils {
    private static _getReplyOptions(ctx: BotContext, options: ReplyOptions) {
        const {
            keyboard,
            chatId,
            entities,
            isDisableLinkPreview = true
        } = options
        const messageId = ctx.msgId

        return {
            parse_mode: 'HTML' as const,
            reply_markup: keyboard,
            reply_parameters: !chatId && messageId ? {
                message_id: messageId,
                allow_sending_without_reply: true
            } : undefined,
            entities,
            link_preview_options: {
                is_disabled: isDisableLinkPreview
            }
        }
    }

    private static _getReplyMediaOptions(ctx: BotContext, options: ReplyMediaOptions) {
        const {
            key,
            vars,
            entities
        } = options

        return {
            ...this._getReplyOptions(ctx, options),
            caption: key && ctx.t(key, vars),
            entities: undefined,
            caption_entities: entities
        } as const
    }

    private static async _replyMedia<T extends ReplyMediaType>({
        ctx,
        file,
        options,
        type
    }: MediaOptions<T>): Promise<ReplyMessageResult[T] | undefined> {
        const {
            chatId
        } = options

        return await ExceptionUtils.handleAsync(
            async () => {
                const other = this._getReplyMediaOptions(ctx, options)

                if (chatId) {
                    return await ctx.api[`send${type}`](
                        chatId,
                        file,
                        other
                    )
                }

                return await ctx[`replyWith${type}`](
                    file,
                    other
                )
            }
        ) as ReplyMessageResult[T] | undefined
    }

    static async reply(ctx: BotContext, key: string, options: ReplyOptions = {}): Promise<Message.TextMessage | undefined> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const {
                    vars,
                    chatId
                } = options

                const other = this._getReplyOptions(ctx, options)
                const text = ctx.t(key, vars)

                const result = chatId ?
                    await ctx.api.sendMessage(
                        chatId,
                        text,
                        other
                    ) :
                    await ctx.reply(
                        text,
                        other
                    )

                Logger.system('MessageUtils.reply', result)
                return result
            }
        )
    }

    static async replyTextAsDocument(ctx: BotContext, text: string, options: ReplyTextAsDocumentOptions = {}): Promise<Message.DocumentMessage | undefined> {
        const {
            chatId
        } = options

        return await ExceptionUtils.handleAsync(
            async () => {
                const other = this._getReplyMediaOptions(ctx, options)
                const file = new InputFile(
                    Buffer.from(text, 'utf-8'),
                    options.filename
                )

                if (chatId) {
                    return await ctx.api.sendDocument(
                        chatId,
                        file,
                        other
                    )
                }

                return await ctx.replyWithDocument(
                    file,
                    other
                )
            }
        )
    }

    static async replyPhoto(ctx: BotContext, file: string, options: ReplyMediaOptions = {}): Promise<Message.PhotoMessage | undefined> {
        return await this._replyMedia({
            ctx,
            file,
            options,
            type: 'Photo'
        })
    }

    static async replyDocument(ctx: BotContext, file: string, options: ReplyMediaOptions = {}): Promise<Message.DocumentMessage | undefined> {
        return await this._replyMedia({
            ctx,
            file,
            options,
            type: 'Document'
        })
    }

    static async replyDice(ctx: BotContext, emoji: Dices, options: ReplyMediaOptions = {}): Promise<Message.DiceMessage | undefined> {
        return await this._replyMedia({
            ctx,
            file: emoji,
            options,
            type: 'Dice'
        })
    }

    static async replyVideo(ctx: BotContext, file: string, options: ReplyMediaOptions = {}): Promise<Message.VideoMessage | undefined> {
        return await this._replyMedia({
            ctx,
            file,
            options,
            type: 'Video'
        })
    }

    static async replyGif(ctx: BotContext, file: string, options: ReplyMediaOptions = {}): Promise<Message.AnimationMessage | undefined> {
        return await this._replyMedia({
            ctx,
            file,
            options,
            type: 'Animation'
        })
    }

    static async replySticker(ctx: BotContext, file: string, options: ReplyMediaOptions = {}): Promise<Message.StickerMessage | undefined> {
        return await this._replyMedia({
            ctx,
            file,
            options,
            type: 'Sticker'
        })
    }

    static async replyRandomSticker(
        ctx: BotContext,
        stickerPackName: string,
        options?: ReplyMediaOptions
    ): Promise<Message.StickerMessage | undefined> {
        const stickerPack = await ContextUtils.getStickerPack(
            ctx,
            stickerPackName
        )
        const stickers = stickerPack?.stickers ?? []
        const sticker = RandomUtils.choose(stickers)
        if (!sticker) return undefined

        return await this.replySticker(
            ctx,
            sticker.file_id,
            options
        )
    }

    static async editText(ctx: BotContext, key: string, options: ReplyOptions = {}): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const {
                    vars
                } = options

                const text = ctx.t(key, vars)
                return await ctx.editMessageText(
                    text,
                    this._getReplyOptions(ctx, options)
                ) && true
            },
            false
        )
    }

    static async editMedia(ctx: BotContext, file: string, options: EditMediaOptions = {}): Promise<boolean> {
        const type = options.type ?? 'image'
        const other = this._getReplyMediaOptions(ctx, options)

        Logger.debug(
            'MessageUtils.editMedia',
            {
                file,
                type,
                other,
                options
            }
        )

        return await ExceptionUtils.handleAsync(
            async () => {
                const result = await ctx.editMessageMedia(
                    InputMediaBuilder[type == 'image' ? 'photo' : type](
                        file,
                        other
                    ),
                    other
                )
                return Boolean(result)
            },
            false
        )
    }

    static async deleteMessages(ctx: BotContext, msgIds?: number | number[]): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const messageIds = typeof msgIds == 'number' ?
                    [msgIds] :
                    msgIds

                if (messageIds && messageIds.length > 0) {
                    return await ctx.deleteMessages(messageIds)
                }

                return await ctx.deleteMessage()
            },
            false
        )
    }

    static async pin(ctx: BotContext, messageId?: number): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const msgId = messageId ?? ctx.msgId
                if (!msgId) return false

                return await ctx.pinChatMessage(msgId)
            },
            false
        )
    }

    static async unpin(ctx: BotContext, messageId?: number): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const msgId = messageId ?? ctx.msgId
                if (!msgId) return false

                return await ctx.unpinChatMessage(msgId)
            },
            false
        )
    }

    static async copyMessage(ctx: BotContext, chatId: number, options: CopyMessageOptions = {}): Promise<MessageId | undefined> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const other = this._getReplyOptions(ctx, options)
                return ctx.copyMessage(
                    chatId,
                    other
                )
            }
        )
    }
}