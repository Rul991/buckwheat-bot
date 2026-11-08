import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelEffectsButtonData, DuelEffectsButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import DuelEffectService from "../../../../db/services/duel/DuelEffectService"
import UserService from "../../../../db/services/user/UserService"
import { backFightDuelKeyboard } from "../../../keyboards/duel"

class DuelEffectsButton extends CallbackQueryAction<DuelEffectsButtonData> {
    override schema: GenMessage<DuelEffectsButtonData> = DuelEffectsButtonDataSchema
    override defaultTextKey: string = 'duel/button/effects'
    override minimumRank: number = RankUtils.min
    override settingId: number = 195
    override name: string = 'dueleffects'

    protected override async _getId(options: CallbackQueryActionOptions<DuelEffectsButtonData>): Promise<number | number[] | undefined> {
        return await options.ctx.vars.duel.currentDuelist.get()
    }

    protected override async _execute(options: CallbackQueryActionOptions<DuelEffectsButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            chatId,
            id: userId
        } = options

        const duelistEffectsMap = await DuelEffectService.getDuelistsEffects(chatId)
        const duelistEffects = await Promise.all(
            duelistEffectsMap.entries()
                .map(async ([id, effects]) => {
                    const user = id == userId ?
                        await ctx.vars.user.get() :
                        await UserService.get(chatId, id)
                    return {
                        user,
                        effects: effects.map(v => {
                            return {
                                title: v.skill.getTitle(ctx),
                                steps: v.steps
                            }
                        })
                    }
                })
                .toArray()
        )

        await MessageUtils.editText(
            ctx,
            'duel/message/effects',
            {
                vars: {
                    duelistEffects
                },
                keyboard: await backFightDuelKeyboard(
                    ctx,
                    {}
                )
            }
        )
    }
}

export default new DuelEffectsButton()
