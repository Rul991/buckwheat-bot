import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type BaseScrollerData, BaseScrollerDataSchema } from "../../../../protos/scroller_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import type Recipe from "../../../../utils/recipes/Recipe"
import ScrollerButton from "../scroller/ScrollerButton"
import RecipeUtils from "../../../../utils/recipes/RecipeUtils"
import ExperienceUtils from "../../../../utils/level/ExperienceUtils"
import RecipeShowButton from "./RecipeShowButton"

class RecipeScrollerButton extends ScrollerButton<Recipe, BaseScrollerData> {
    override schema: GenMessage<BaseScrollerData> = BaseScrollerDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 121
    override name: string = 'rsc'

    protected override _isNeedCache: boolean = false
    protected override _objectsPerPage: number = 5
    
    protected override async _getRawObjects(options: CallbackQueryActionOptions<BaseScrollerData>): Promise<Recipe[]> {
        const {

        } = options
        return RecipeUtils.getAll()
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Recipe, BaseScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects,
            ctx,
            id,
            page
        } = options

        const bigId = BigInt(id)
        const count = 1

        const levelObject = await ctx.vars.level.get()
        const level = ExperienceUtils.getLevelFromObject(levelObject)

        for (const recipe of slicedObjects) {
            const item = recipe.result.item
            const canCraft = level >= recipe.level

            keyboard.add(
                RecipeShowButton.button({
                    ctx,
                    vars: {
                        item: item.getVars(ctx),
                        count: recipe.result.count
                    },
                    data: {
                        id: bigId,
                        recipeId: recipe.id,
                        count,
                        page
                    },
                    style: canCraft ? undefined : 'danger'
                })
            )
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Recipe, BaseScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'craft/message/start'
        }
    }
}

export default new RecipeScrollerButton()