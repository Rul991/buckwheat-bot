import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RoleplayScrollerButtonDataSchema, type RoleplayScrollerButtonData } from "../../../../protos/rp_pb"
import ScrollerButton from "../scroller/ScrollerButton"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import type Roleplay from "../../../../db/entities/rp/Roleplay"
import RoleplayService from "../../../../db/services/rp/RoleplayService"
import { InlineKeyboard } from "grammy"
import RoleplayShowButton from "./RoleplayShowButton"

class RoleplayScrollerButton extends ScrollerButton<Roleplay, RoleplayScrollerButtonData> {
    override schema: GenMessage<RoleplayScrollerButtonData> = RoleplayScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 61
    override name: string = 'rplist'

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Roleplay, RoleplayScrollerButtonData>): Promise<InlineKeyboard> {
        const {
            ctx,
            id,
            slicedObjects,
            page
        } = options

        const keyboard = new InlineKeyboard()
        for (const roleplay of slicedObjects) {
            keyboard
                .add(RoleplayShowButton.button({
                    ctx,
                    data: {
                        id: BigInt(id),
                        page,
                        objectId: roleplay._id!.id
                    },
                    vars: {
                        name: roleplay.name
                    }
                }))
                .row()
        }

        return keyboard
    }

    protected override async _getRawObjects(options: CallbackQueryActionOptions<RoleplayScrollerButtonData>): Promise<Roleplay[]> {
        const {
            chatId
        } = options

        return await RoleplayService.getAllByChatId(chatId)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Roleplay, RoleplayScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            objects
        } = options
        const count = objects.length

        return {
            key: 'rp/start',
            vars: {
                count
            }
        }
    }
}

export default new RoleplayScrollerButton()