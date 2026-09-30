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
import ShortCommandDeleteButton from "./ShortCommandDeleteButton"
import CommandUtils from "../../../../utils/command/CommandUtils"

class ShortCommandScrollerButton extends ScrollerButton<ShortCommand, ShortCommandScrollerButtonData> {
    override schema: GenMessage<ShortCommandScrollerButtonData> = ShortCommandScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 84
    override name: string = 'scscr'
    protected override _objectsPerPage: number = 1

    protected override async _getRawObjects(options: CallbackQueryActionOptions<ShortCommandScrollerButtonData>): Promise<ShortCommand[]> {
        const {
            id
        } = options

        return await ShortCommandService.getAllByUserId(id)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<ShortCommand, ShortCommandScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()

        const {
            slicedObjects: [shortCommand],
            ctx,
            id
        } = options
        if (!shortCommand) return keyboard

        keyboard
            .copyText(
                ctx.t('shorten/copy/text'),
                ctx.t(
                    'shorten/copy/value',
                    {
                        shortCommand
                    }
                )
            )
            .style('primary')

        keyboard.add(ShortCommandDeleteButton.button({
            ctx,
            data: {
                command: shortCommand._id!.id,
                id: BigInt(id)
            },
            style: 'danger'
        }))

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<ShortCommand, ShortCommandScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            slicedObjects: [shortCommand]
        } = options

        if (!shortCommand) return {
            key: 'shorten/not-exist'
        }

        const {
            command,
            text
        } = shortCommand

        return {
            key: 'shorten/show',
            vars: {
                command,
                text,
                botNames: CommandUtils.botNames
            }
        }
    }
}

export default new ShortCommandScrollerButton()