import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { BaseScrollerDataSchema, type BaseScrollerData } from "../../../../protos/scroller_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import TopUtils from "../../../../utils/top/TopUtils"
import { InlineKeyboard } from "grammy"
import TopScrollerButton from "./TopScrollerButton"

class TopsButtonScrollerButton extends ScrollerButton<number> {
    override schema: GenMessage<BaseScrollerData> = BaseScrollerDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 78
    override name: string = 'tops'

    protected override _isNeedCache: boolean = false
    protected override _objectsPerPage: number = 4

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<number, BaseScrollerData>): Promise<InlineKeyboard> {
        const {
            slicedObjects,
            ctx,
            data,
            page
        } = options

        const id = data.data?.id
        const keyboard = new InlineKeyboard()

        for (const type of slicedObjects) {
            const subCommand = TopUtils.getSubCommand(type)
            keyboard
                .add(TopScrollerButton.button({
                    ctx,
                    data: {
                        type,
                        data: {
                            id,
                            data: {
                                case: 'update',
                                value: false
                            },
                            $typeName: 'ScrollerData',
                        },
                        page
                    },
                    key: 'top/text/button',
                    vars: {
                        title: subCommand.title(ctx),
                        emoji: subCommand.emoji(ctx)
                    }
                }))
                .row()
        }

        return keyboard
    }

    protected override async _getRawObjects(_options: CallbackQueryActionOptions<BaseScrollerData>): Promise<number[]> {
        return TopUtils.keys
    }

    protected override async _editMessage(_options: ScrollerButtonEditMessageOptions<number, BaseScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        return {
            key: 'top/text/start'
        }
    }
}

export default new TopsButtonScrollerButton()