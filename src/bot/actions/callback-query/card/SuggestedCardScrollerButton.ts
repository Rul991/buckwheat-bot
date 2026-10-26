import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type SuggestedCardScrollerButtonData, SuggestedCardScrollerButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import CardService from "../../../../db/services/card/CardService"
import type Card from "../../../../db/entities/card/Card"
import { DEV_ID } from "../../../../consts/env"
import SuggestedCardModerateButton from "./SuggestedCardModerateButton"

type T = Card

class SuggestedCardScrollerButton extends ScrollerButton<T, SuggestedCardScrollerButtonData> {
    override schema: GenMessage<SuggestedCardScrollerButtonData> = SuggestedCardScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 162
    override name: string = 'sugscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 1

    protected override async _getRawObjects(options: CallbackQueryActionOptions<SuggestedCardScrollerButtonData>): Promise<T[]> {
        const {

        } = options
        return await CardService.getSuggested()
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<T, SuggestedCardScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: [card],
            ctx,
            id,
        } = options
        if(id != DEV_ID) return keyboard
        if(!card) return keyboard

        const bigId = BigInt(id)
        for (const isApprove of [true, false]) {
            keyboard.add(
                SuggestedCardModerateButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        isApprove,
                        cardId: card.id
                    },
                    style: isApprove ? 'success' : 'danger',
                    vars: {
                        id,
                        DEV_ID
                    }
                })
            )
        }

        return keyboard
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<T, SuggestedCardScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            slicedObjects: [card],
        } = options
        if(!card) {
            return {
                key: 'card/message/not-exist'
            }
        }

        return {
            key: 'card/message/show/suggest',
            vars: {
                card
            },
            media: {
                type: 'image',
                fileId: card.image
            }
        }
    }
}

export default new SuggestedCardScrollerButton()