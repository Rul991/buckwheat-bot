import { CommandType } from "../../../protos/commands_pb"
import type { PhotoActionOptions } from "../../../types/action-options"
import type { MessagePhotoContext } from "../../../types/contexts"
import type { ShowableActionGetOptions } from "../../../types/options"
import MessageUtils from "../../../utils/bot/MessageUtils"
import type PhotoAction from "../../actions/base/PhotoAction"
import ShowableActionHandler from "./ShowableActionHandler"

export default class PhotoActionHandler extends ShowableActionHandler<PhotoAction> {
    protected override _getText(ctx: MessagePhotoContext): string {
        return ctx.msg.caption ?? ''
    }

    protected override _getOptions(options: ShowableActionGetOptions<PhotoAction>): PhotoActionOptions {
        const {
            ctx,
            chatId,
            id
        } = options

        const photos = ctx.msg.photo
        const highQualityPhoto = photos[photos.length - 1]!

        return {
            ctx,
            chatId,
            id,
            highQualityPhoto
        }
    }

    constructor() {
        super(CommandType.Photo)
    }

    protected override async _executeAction(action: PhotoAction, options: PhotoActionOptions): Promise<void> {
        const result = await action.execute(options)
        if (!result) return

        const {
            options: messageOptions,
        } = result

        const {
            ctx
        } = options

        if ('photo' in result) {
            const photo = result.photo
            await MessageUtils.replyPhoto(
                ctx,
                photo,
                messageOptions
            )
            return
        }

        const key = result.key

        await MessageUtils.reply(
            ctx,
            key,
            messageOptions
        )
    }
}