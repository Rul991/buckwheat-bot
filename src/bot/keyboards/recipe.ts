import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ArrayUtils from "../../utils/math/ArrayUtils"
import type Recipe from "../../utils/recipes/Recipe"
import CraftButton from "../actions/callback-query/craft/CraftButton"
import RecipeScrollerButton from "../actions/callback-query/craft/RecipeScrollerButton"
import RecipeShowButton from "../actions/callback-query/craft/RecipeShowButton"

export const startRecipeKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)

        keyboard.add(
            RecipeScrollerButton.button({
                ctx,
                data: {
                    data: {
                        id,
                        data: {
                            case: 'update',
                            value: false
                        },
                        $typeName: 'ScrollerData'
                    }
                },
                key: 'button/show'
            })
        )
    }
)

export const showRecipeKeyboard = KeyboardCreator.create<{
    id: number
    recipe: Recipe
    count: number
    page: number
    level: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const {
            recipe,
            count,
            page,
            level,
        } = data
        const recipeId = recipe.id

        const gridWidth = 6
        const maxLength = 20
        const maxValue = 500_000

        const sequence = ArrayUtils.generateMultipliedSequence({
            maxLength,
            maxValue,
            avoidNumber: count,
        })

        const grid = ArrayUtils.objectsGrid({
            width: gridWidth,
            objects: sequence
        })

        for (const row of grid) {
            for (const count of row) {
                keyboard.add(
                    RecipeShowButton.button({
                        ctx,
                        data: {
                            id,
                            recipeId,
                            page,
                            count,
                        },
                        key: 'button/number',
                        vars: {
                            value: count
                        }
                    })
                )
            }
            keyboard.row()
        }

        if (level >= recipe.level) {
            keyboard
                .add(
                    CraftButton.button({
                        ctx,
                        data: {
                            count,
                            id,
                            recipeId,
                            page
                        }
                    })
                )
                .row()
        }

        keyboard
            .add(
                RecipeScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            data: {
                                case: 'page',
                                value: page
                            },
                            id,
                            $typeName: 'ScrollerData'
                        }
                    },
                    key: 'button/back'
                })
            )

    }
)