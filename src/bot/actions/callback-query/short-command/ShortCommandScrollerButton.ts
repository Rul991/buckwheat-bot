import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type ShortCommand from "../../../../db/entities/short/ShortCommand"
import { ShortCommandScrollerButtonDataSchema, type ShortCommandScrollerButtonData } from "../../../../protos/short-command_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import ShortCommandService from "../../../../db/services/short/ShortCommandService"
import { InlineKeyboard } from "grammy"
import ShortCommandShowButton from "./ShortCommandShowButton"
import ShortCommandAddButton from "./ShortCommandAddButton"

class ShortCommandScrollerButton extends ScrollerButton<ShortCommand, ShortCommandScrollerButtonData> {
    override schema: GenMessage<ShortCommandScrollerButtonData> = ShortCommandScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 84
    override name: string = 'scscr'
    protected override _objectsPerPage: number = 6
    protected override _stopIfNoObjects: boolean = false

    protected override async _getRawObjects(options: CallbackQueryActionOptions<ShortCommandScrollerButtonData>): Promise<ShortCommand[]> {
        const {
            id
        } = options

        return await ShortCommandService.getAllByUserId(id)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<ShortCommand, ShortCommandScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()

        const {
            slicedObjects: shortCommands,
            ctx,
            page
        } = options
        const id = BigInt(options.id)

        for (const shortCommand of shortCommands) {
            keyboard.add(
                ShortCommandShowButton.button({
                    ctx,
                    data: {
                        page,
                        id,
                        command: shortCommand._id!.id
                    },
                    vars: {
                        shortCommand
                    }
                })
            )
        }

        keyboard.add(
            ShortCommandAddButton.button({
                ctx,
                data: {
                    id
                },
                style: 'success'
            })
        )

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(_options: ScrollerButtonEditMessageOptions<ShortCommand, ShortCommandScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        return {
            key: 'shorten/list',
        }
    }
}

export default new ShortCommandScrollerButton()