import { MAX_SELECTED_SKILLS_COUNT } from "../../consts/number"
import SelectedSkillsService from "../../db/services/duel/SelectedSkillsService"
import { SkillShowType } from "../../protos/skills_pb"
import SkillRegistry from "../../utils/duel/skill/SkillRegistry"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ExperienceUtils from "../../utils/level/ExperienceUtils"
import SelectedSkillsMenuButton from "../actions/callback-query/skills/SelectedSkillsMenuButton"
import SkillAddButton from "../actions/callback-query/skills/SkillAddButton"
import SkillAddScrollerButton from "../actions/callback-query/skills/SkillAddScrollerButton"
import SkillRemoveButton from "../actions/callback-query/skills/SkillRemoveButton"
import SkillShowButton from "../actions/callback-query/skills/SkillShowButton"

export const selectedSkillsMenuKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const chatId = ctx.vars.chatId!
        const id = BigInt(data.id)
        const {
            id: userId
        } = data

        const selectedSkills = await SelectedSkillsService.getSkills(
            chatId,
            userId
        )

        for (let i = 0; i < MAX_SELECTED_SKILLS_COUNT; i++) {
            const skill = selectedSkills[i]

            if (skill) {
                keyboard.add(
                    SkillShowButton.button({
                        ctx,
                        data: {
                            id,
                            type: SkillShowType.Selected,
                            skillId: skill.id
                        },
                        vars: {
                            title: skill.getTitle(ctx)
                        }
                    })
                )
            }
            else {
                keyboard.add(
                    SkillAddScrollerButton.button({
                        ctx,
                        data: {
                            data: {
                                $typeName: 'ScrollerData',
                                id,
                                data: {
                                    case: 'update',
                                    value: false
                                },
                            }
                        },
                        key: 'skills/button/add',
                    })
                )
            }
        }

        return keyboard.toFlowed(1)
    }
)

export const addSkillKeyboard = KeyboardCreator.create<{
    id: number
    page: number
    skillId: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const userId = ctx.vars.id
        const chatId = ctx.vars.chatId!

        const id = BigInt(data.id)
        const {
            skillId,
            page
        } = data

        const skill = SkillRegistry.get(skillId)
        if (skill) {
            const levelObject = await ctx.vars.level.get()
            const level = ExperienceUtils.getLevelFromObject(levelObject)

            const user = await ctx.vars.user.require()
            const className = user.className

            const canAdd = skill ?
                await SelectedSkillsService.canAdd({
                    chatId,
                    id: userId,
                    skill,
                    className,
                    level
                }) :
                false

            if (canAdd) {
                keyboard
                    .add(
                        SkillAddButton.button({
                            ctx,
                            data: {
                                skillId,
                                id,
                            },
                            style: 'success'
                        })
                    )
            }
        }

        keyboard
            .add(
                SkillAddScrollerButton.button({
                    ctx,
                    key: 'button/back',
                    data: {
                        data: {
                            id,
                            $typeName: 'ScrollerData',
                            data: {
                                case: 'page',
                                value: page
                            }
                        }
                    }
                })
            )
        return keyboard.toFlowed(1)
    }
)

export const selectedSkillKeyboard = KeyboardCreator.create<{
    id: number
    skillId: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const {
            skillId,
        } = data

        keyboard
            .add(
                SkillRemoveButton.button({
                    ctx,
                    data: {
                        skillId,
                        id,
                    },
                    style: 'danger'
                })
            )
            .add(
                SelectedSkillsMenuButton.button({
                    ctx,
                    key: 'button/back',
                    data: {
                        id
                    }
                })
            )
        return keyboard.toFlowed(1)
    }
)