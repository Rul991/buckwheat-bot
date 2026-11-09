import DuelStepService from "../../../../db/services/duel/DuelStepService"
import type { ConditionalCommandOptions } from "../../../../types/action-options"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import DuelUtils from "../../../../utils/duel/duel/DuelUtils"
import { duelAwayKeyboard } from "../../../keyboards/duel"
import ConditionalCommand from "../../base/ConditionalCommand"

export default class OnDuelConditionalCommand extends ConditionalCommand {
    override async condition(options: ConditionalCommandOptions): Promise<boolean> {
        const {
            ctx,
            id
        } = options

        const duel = await ctx.vars.duel.duel.get()
        if (!duel) {
            return false
        }

        const onDuel = DuelUtils.onDuel(duel, id)
        return onDuel
    }

    override async execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        const {
            ctx,
            id,
        } = options

        const duel = await ctx.vars.duel.duel.require()
        const isExpired = await DuelStepService.isExpired(duel)

        if (isExpired) {
            const currentDuelist = await ctx.vars.duel.currentDuelist.get()
            await DuelUtils.end({
                duel,
                loser: currentDuelist,
                ctx,
                isDelete: false,
                isKick: true
            })
            return
        }

        await MessageUtils.reply(
            ctx,
            'duel/message/on-duel',
            {
                keyboard: await duelAwayKeyboard(ctx, { id })
            }
        )
    }
}