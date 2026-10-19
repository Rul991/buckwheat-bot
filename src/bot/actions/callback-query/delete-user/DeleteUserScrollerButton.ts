import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type DeleteUserScrollerButtonData, DeleteUserScrollerButtonDataSchema } from "../../../../protos/delete-user_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import MessagesService from "../../../../db/services/message/MessagesService"
import DeleteUserButton from "./DeleteUserButton"

type T = Awaited<ReturnType<typeof MessagesService['getTotalUnactiveUsers']>>[number]

class DeleteUserScrollerButton extends ScrollerButton<T, DeleteUserScrollerButtonData> {
    override schema: GenMessage<DeleteUserScrollerButtonData> = DeleteUserScrollerButtonDataSchema
    override minimumRank: number = RankUtils.max
    override settingId: number = 157
    override name: string = 'duscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 5

    protected override async _getRawObjects(options: CallbackQueryActionOptions<DeleteUserScrollerButtonData>): Promise<T[]> {
        const {
            ctx,
            chatId
        } = options
        const meId = ctx.me.id
        return await MessagesService.getTotalUnactiveUsers(chatId, meId)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<T, DeleteUserScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: users,
            ctx,
            id,
        } = options
        const bigId = BigInt(id)

        for (const user of users) {
            keyboard.add(
                DeleteUserButton.button({
                    ctx,
                    vars: {
                        user
                    },
                    data: {
                        id: bigId,
                        deletedUserId: BigInt(user.id)
                    },
                    style: 'danger'
                })
            )
        }

        keyboard.add(
            DeleteUserButton.button({
                ctx,
                data: {
                    id: bigId
                },
                style: 'danger'
            })
        )

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<T, DeleteUserScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'delete-user/message/start'
        }
    }
}

export default new DeleteUserScrollerButton()