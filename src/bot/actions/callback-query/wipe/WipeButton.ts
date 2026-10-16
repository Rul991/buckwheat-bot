import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type WipeButtonData, WipeButtonDataSchema } from "../../../../protos/wipe_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import TotalService from "../../../../db/services/total/TotalService"

class WipeButton extends CallbackQueryAction<WipeButtonData> {
    override schema: GenMessage<WipeButtonData> = WipeButtonDataSchema
    override defaultTextKey: string = 'wipe/button'
    override minimumRank: number = RankUtils.min
    override settingId: number = 140
    override name: string = 'wipe'

    protected override async _getId(options: CallbackQueryActionOptions<WipeButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<WipeButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            chatId
        } = options

        const {
            isWipe
        } = data
        const user = await ctx.vars.user.get()

        if (!isWipe) {
            await Promise.all([
                MessageUtils.editText(
                    ctx,
                    'wipe/dont-wipe',
                    {
                        vars: {
                            user
                        }
                    }
                )
            ])
            return
        }

        await Promise.all([
            TotalService.wipe(chatId),
            MessageUtils.deleteMessages(ctx),
            MessageUtils.reply(
                ctx,
                'wipe/wiped',
                {
                    vars: {
                        user
                    }
                }
            )
        ])
    }
}

export default new WipeButton()