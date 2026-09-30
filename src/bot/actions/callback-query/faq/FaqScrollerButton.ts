import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type FaqScrollerButtonData, FaqScrollerButtonDataSchema } from "../../../../protos/faq_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import FaqUtils from "../../../../utils/faq/FaqUtils"
import FaqButton from "./FaqButton"
import { UNKNOWN_TEXT } from "../../../../consts/texts"

type T = {
    value: string
    index: number
}

class FaqScrollerButton extends ScrollerButton<T, FaqScrollerButtonData> {
    override schema: GenMessage<FaqScrollerButtonData> = FaqScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 114
    override name: string = 'faqscr'

    protected override _isNeedCache: boolean = false
    protected override _objectsPerPage: number = 7

    protected override async _getRawObjects(_options: CallbackQueryActionOptions<FaqScrollerButtonData>): Promise<T[]> {
        return FaqUtils.getAll()
            .map((v, i) => {
                return {
                    value: v,
                    index: i
                }
            })
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<T, FaqScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects,
            ctx,
            page
        } = options

        for (const faq of slicedObjects) {
            const title = FaqUtils.getTitle(ctx, faq.index) ?? UNKNOWN_TEXT
            keyboard.add(
                FaqButton.button({
                    ctx,
                    data: {
                        index: faq.index,
                        page
                    },
                    vars: {
                        title
                    }
                })
            )
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<T, FaqScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'faq/message/start'
        }
    }
}

export default new FaqScrollerButton()