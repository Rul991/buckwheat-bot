import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type UnpackCardBoxButtonData, UnpackCardBoxButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import UserCardService from "../../../../db/services/card/UserCardService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { unpackCardKeyboard } from "../../../keyboards/cards"

class UnpackCardBoxButton extends CallbackQueryAction<UnpackCardBoxButtonData> {
    override schema: GenMessage<UnpackCardBoxButtonData> = UnpackCardBoxButtonDataSchema
    override defaultTextKey: string = 'card/button/unpack'
    override minimumRank: number = RankUtils.min
    override settingId: number = 164
    override name: string = 'unpck'
    
    protected override async _getId(options: CallbackQueryActionOptions<UnpackCardBoxButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<UnpackCardBoxButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            id,
            ctx,
            data
        } = options

        const {
            tries = 0
        } = data

        const unpackResult = await UserCardService.unpack({
            chatId,
            id,
            ctx
        })

        if(!unpackResult.ok) {
            return {
                key: `card/message/reason/${unpackResult.reason}`,
                vars: {
                    isUnpack: true
                }
            }
        }

        const {
            card,
            isDuplicate
        } = unpackResult

        await MessageUtils.editMedia(
            ctx,
            card.image,
            {
                vars: {
                    card,
                    isDuplicate,
                    tries
                },
                keyboard: await unpackCardKeyboard(
                    ctx,
                    {
                        id,
                        tries: tries + 1
                    }
                ),
                key: 'card/message/show/unpack'
            }
        )
    }
}

export default new UnpackCardBoxButton()
