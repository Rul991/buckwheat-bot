import SelectedSkillsService from "../../db/services/duel/SelectedSkillsService"
import UserService from "../../db/services/user/UserService"
import { SkillShowType } from "../../protos/skills_pb"
import { characters } from "../../resources/duels/characters/characters"
import ClassUtils from "../../utils/db/ClassUtils"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import DeleteButton from "../actions/callback-query/delete/DeleteButton"
import DuelAwayButton from "../actions/callback-query/duel/DuelAwayButton"
import DuelEffectsButton from "../actions/callback-query/duel/DuelEffectsButton"
import DuelFightButton from "../actions/callback-query/duel/DuelFightButton"
import DuelNoButton from "../actions/callback-query/duel/DuelNoButton"
import DuelSkillsButton from "../actions/callback-query/duel/DuelSkillsButton"
import DuelSkillUseButton from "../actions/callback-query/duel/DuelSkillUseButton"
import DuelYesButton from "../actions/callback-query/duel/DuelYesButton"
import SkillShowButton from "../actions/callback-query/skills/SkillShowButton"

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
        const currentDuelist = await ctx.vars.duel.currentDuelist.get()
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

export const duelFightKeyboard = KeyboardCreator.create<{
    
}>(
    async ({
        ctx,
        keyboard
    }) => {
        const id = ctx.vars.id
        const chatId = ctx.vars.chatId!
        const currentDuelistId = await ctx.vars.duel.currentDuelist.get()

        const user = id == currentDuelistId ?
            await ctx.vars.user.require() :
            await UserService.get(chatId, currentDuelistId)
        const className = user?.className ?? ClassUtils.defaultClassName
        const character = characters[className]
        const mainSkill = character.skills.main

        keyboard.add(
            DuelSkillUseButton.button({
                ctx,
                data: {
                    skillId: mainSkill.id
                },
                key: 'duel/button/attack',
            }),
            DuelEffectsButton.button({
                ctx,
                data: {}
            }),
            DuelSkillsButton.button({
                ctx,
                data: {}
            })
        )
    }
)

export const backFightDuelKeyboard = KeyboardCreator.create<{
    key?: string
}>(
    async ({
        ctx,
        keyboard,
        data: {
            key = 'button/back'
        }
    }) => {
        keyboard.add(
            DuelFightButton.button({
                ctx,
                data: {},
                key
            })
        )
    }
)

export const skillsDuelKeyboard = KeyboardCreator.create<{

}>(
    async ({
        ctx,
        keyboard
    }) => {
        const id = ctx.vars.id
        const bigId = BigInt(id)
        const chatId = ctx.vars.chatId!

        const skills = await SelectedSkillsService.getSkills(
            chatId,
            id
        )

        for (const skill of skills) {
            keyboard.add(
                SkillShowButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        skillId: skill.id,
                        type: SkillShowType.Duel
                    },
                    vars: {
                        title: skill.getTitle(ctx)
                    }
                })
            )
        }

        keyboard.add(
            DuelFightButton.button({
                ctx,
                data: {},
                key: 'button/back'
            })
        )

        return keyboard.toFlowed(1)
    }
)

export const skillUseShowDuelKeyboard = KeyboardCreator.create<{
    skillId: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const {
            skillId
        } = data

        keyboard.add(
            DuelSkillUseButton.button({
                ctx,
                data: {
                    skillId: skillId
                },
                style: 'primary'
            }),
            DuelSkillsButton.button({
                ctx,
                data: {},
                key: 'button/back'
            })
        )
        return keyboard.toFlowed(1)
    }
)