import { MAX_AWARD_RANK, MIN_AWARD_RANK } from "../../consts/award"
import type Award from "../../db/entities/award/Award"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ArrayUtils from "../../utils/math/ArrayUtils"
import AwardDeleteButton from "../actions/callback-query/award/AwardDeleteButton"
import AwardScrollerButton from "../actions/callback-query/award/AwardScrollerButton"

export const startAwardKeyboard = KeyboardCreator.create<{
    ownerId: number
    userId: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const userId = BigInt(data.userId)
        const ownerId = BigInt(data.ownerId)

        keyboard.add(
            AwardScrollerButton.button({
                ctx,
                key: 'button/show',
                data: {
                    ownerId,
                    data: {
                        $typeName: 'ScrollerData',
                        id: userId,
                        data: {
                            case: 'update',
                            value: false
                        }
                    }
                }
            })
        )
    }
)

export const showAwardKeyboard = KeyboardCreator.create<{
    award: Award
    page: number
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const {
            award,
            page
        } = data

        const id = BigInt(data.id)
        const ownerId = BigInt(award.id)
        const awardId = award.awardId

        if (ctx.vars.id == award.giverId) {
            keyboard.add(
                AwardDeleteButton.button({
                    ctx,
                    style: 'danger',
                    data: {
                        id,
                        awardId
                    }
                })
            )
        }

        keyboard.add(
            AwardScrollerButton.button({
                ctx,
                data: {
                    ownerId,
                    data: {
                        $typeName: 'ScrollerData',
                        id,
                        data: {
                            case: 'page',
                            value: page
                        }
                    }
                },
                key: 'button/back'
            })
        )

        return keyboard.toFlowed(1)
    }
)

export const chooseRankAwardKeyboard = KeyboardCreator.create<{

}>(
    async ({
        ctx,
        keyboard
    }) => {
        const gridWidth = 4
        ArrayUtils.range(MIN_AWARD_RANK, MAX_AWARD_RANK)
            .forEach(rank => {
                const data = rank.toString()
                const text = ctx.t(
                    'award/button/rank',
                    {
                        rank
                    }
                )

                keyboard.text(text, data)
                if (rank % gridWidth == 0) {
                    keyboard.row()
                }
            })
    }
)