import { BOSS_CHANGE_CHANCE } from "../../consts/chances"
import { NEED_BOSS_CLASS_CHANGES } from "../../consts/number"
import ClassUtils from "../../utils/db/ClassUtils"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import RandomUtils from "../../utils/math/RandomUtils"
import AvaHistoryScrollerButton from "../actions/callback-query/user/AvaHistoryScrollerButton"
import ChangeClassButton from "../actions/callback-query/user/ChangeClassButton"

export const classesKeyboard = KeyboardCreator.create<number>(
    async ({
        ctx,
        keyboard,
        data: id
    }) => {
        const classTypes = ClassUtils.getChangeableClassNames()
        const user = await ctx.vars.user.get()
        const classChangedCount = user?.classChangedCount ?? 0
        if (classChangedCount >= NEED_BOSS_CLASS_CHANGES && RandomUtils.chance(BOSS_CHANGE_CHANCE)) {
            classTypes.push('boss')
        }

        for (const type of classTypes) {
            keyboard
                .add(
                    ChangeClassButton.button({
                        ctx,
                        data: {
                            id: BigInt(id),
                            type
                        }
                    })
                )
                .row()
        }
    }
)

export const profileKeyboard = KeyboardCreator.create<{ id?: number }>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const bigId = data.id !== undefined ? BigInt(data.id) : undefined

        keyboard
            .add(
                AvaHistoryScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            data: {
                                case: 'update',
                                value: false
                            },
                            id: bigId,
                            $typeName: 'ScrollerData'
                        }
                    },
                    key: 'ava/button'
                })
            )
    }
)