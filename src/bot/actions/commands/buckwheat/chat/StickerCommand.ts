import ChatService from "../../../../../db/services/chat/ChatService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ContextUtils from "../../../../../utils/bot/ContextUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class StickerCommand extends BuckwheatCommand {
    override aliases: string[] = ['стик', 'стикеры', 'стикерпак']
    override minimumRank: number = RankUtils.moderator
    override settingId: number = 54
    override name: string = 'стикер'
    override filename: string = 'sticker'
    override isSupportReply: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx
        } = options

        const sticker = ctx.msg.reply_to_message?.sticker
        const stickerPackName = sticker?.set_name
        if (!(sticker && stickerPackName)) {
            await ChatService.update(
                chatId,
                {
                    stickerPack: ''
                }
            )

            return {
                key: 'sticker/empty'
            }
        }

        await ChatService.update(
            chatId,
            {
                stickerPack: stickerPackName
            }
        )

        const stickerPack = await ContextUtils.getStickerPack(
            ctx,
            stickerPackName
        )
        const stickerPackTitle = stickerPack?.title ?? stickerPackName
        return {
            key: 'sticker/changed',
            options: {
                vars: {
                    stickerPackTitle
                }
            }
        }
    }
}