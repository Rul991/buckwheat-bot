import DuelStepService from "../../db/services/duel/DuelStepService"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import DeleteButton from "../actions/callback-query/delete/DeleteButton"
import DuelAwayButton from "../actions/callback-query/duel/DuelAwayButton"
import DuelFightButton from "../actions/callback-query/duel/DuelFightButton"
import DuelNoButton from "../actions/callback-query/duel/DuelNoButton"
import DuelYesButton from "../actions/callback-query/duel/DuelYesButton"

export const duelStartKeyboard = KeyboardCreator.create<{
    suggester: number
    reply: number
    prize: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const suggester = BigInt(data.suggester)
        const reply = BigInt(data.reply)
        const {
            prize
        } = data

        keyboard.add(
            DuelYesButton.button({
                ctx,
                data: {
                    replyId: reply,
                    suggesterId: suggester,
                    prize
                },
                style: 'success',
            }),
            DuelNoButton.button({
                ctx,
                data: {
                    replyId: reply,
                    suggesterId: suggester
                },
                style: 'danger',
            }),
        )
    }
)

export const duelAwayKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const duel = await ctx.vars.duel.get()
        const currentDuelist = await DuelStepService.getCurrentDuelist(duel)
        const isMyStep = currentDuelist == data.id

        keyboard.add(
            DuelAwayButton.button({
                ctx,
                data: {},
                style: 'danger'
            }),
            isMyStep ?
                DuelFightButton.button({
                    ctx,
                    data: {},
                    style: 'primary'
                }) :
                DeleteButton.button({
                    ctx,
                    data: { id },
                    style: 'primary',
                    key: 'button/decline'
                })
        )
    }
)