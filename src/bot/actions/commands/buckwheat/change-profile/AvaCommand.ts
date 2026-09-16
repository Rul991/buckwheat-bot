import type { Message } from "grammy/types"
import AvaHistory from "../../../../../db/entities/user/AvaHistory"
import UserAvaService from "../../../../../db/services/user/UserAvaService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import ContextUtils from "../../../../../utils/bot/ContextUtils"
import type { BotContext } from "../../../../../types/bot"

export default class AvaCommand extends BuckwheatCommand {
    override aliases: string[] = ['аватарка']
    override minimumRank: number = RankUtils.min
    override name: string = 'ава'
    override filename: string = 'cmd-ava'
    override settingId: number = 7
    override isSupportReply: boolean = true

    private async _getAvaHistory(ctx: BotContext, replyMessage: Message): Promise<AvaHistory | undefined> {
        const replyMessagePhoto = replyMessage?.photo
        const replyMessageVideo = replyMessage?.video
        const replyMessageGif = replyMessage?.animation

        if (replyMessagePhoto) {
            const highQualityPhoto = replyMessagePhoto.at(-1)!
            return new AvaHistory({
                fileId: highQualityPhoto.file_id,
                type: 'image'
            })
        }
        else if (replyMessageVideo) {
            return new AvaHistory({
                fileId: replyMessageVideo.file_id,
                type: 'video'
            })
        }
        else if (replyMessageGif) {
            return new AvaHistory({
                fileId: replyMessageGif.file_id,
                type: 'animation'
            })
        }

        const id = replyMessage.from?.id
        if (!id) return undefined

        const fileId = await ContextUtils.getUserProfilePhoto(
            ctx,
            id
        )
        if (!fileId) return undefined

        return new AvaHistory({
            type: 'image',
            fileId,
        })
    }

    private async _setAva(chatId: number, id: number, avaHistory: AvaHistory): Promise<BuckwheatCommandExecuteResult> {
        await UserAvaService.set(chatId, id, avaHistory)
        return {
            key: 'profile/ava/change'
        }
    }

    private async _removeAva(chatId: number, id: number): Promise<BuckwheatCommandExecuteResult> {
        await UserAvaService.set(chatId, id, undefined)
        return {
            key: 'profile/ava/remove'
        }
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            ctx
        } = options

        const replyMessage = ctx.msg.reply_to_message
        if (replyMessage) {
            const avaHistory = await this._getAvaHistory(ctx, replyMessage)
            if (!avaHistory) return await this._removeAva(chatId, id)

            return await this._setAva(
                chatId,
                id,
                avaHistory
            )
        }

        return await this._removeAva(chatId, id)
    }
}