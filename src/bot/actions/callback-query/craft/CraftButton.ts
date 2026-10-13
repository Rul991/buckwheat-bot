import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type CraftButtonData, CraftButtonDataSchema } from "../../../../protos/recipe_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RecipeUtils from "../../../../utils/recipes/RecipeUtils"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ExperienceUtils from "../../../../utils/level/ExperienceUtils"
import ClassUtils from "../../../../utils/db/ClassUtils"

class CraftButton extends CallbackQueryAction<CraftButtonData> {
    override schema: GenMessage<CraftButtonData> = CraftButtonDataSchema
    override defaultTextKey: string = 'craft/button/craft'
    override minimumRank: number = RankUtils.min
    override settingId: number = 123
    override name: string = 'craft'

    protected override async _getId(options: CallbackQueryActionOptions<CraftButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<CraftButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx
        } = options

        const {
            recipeId,
            count,
            page
        } = data

        const user = await ctx.vars.user.get()
        const className = user?.className ?? ClassUtils.defaultClassName

        if(!ClassUtils.canCraft(className)) {
            return {
                key: 'craft/message/not-engineer'
            }
        }

        const recipe = RecipeUtils.get(recipeId)
        if (!recipe) return

        const levelObject = await ctx.vars.level.get()
        const level = ExperienceUtils.getLevelFromObject(levelObject)

        if(recipe.level > level) {
            return {
                key: 'craft/cant/low-level'
            }
        }

        const { ok, reason } = await InventoryItemService.craft({
            chatId,
            id,
            recipe,
            count
        })

        if (ok) {
            const {
                key,
                options: messageOptions
            } = await RecipeUtils.show({
                ctx,
                recipe,
                count,
                page
            })

            await MessageUtils.editText(
                ctx,
                key,
                messageOptions
            )

            const totalCount = recipe.result.count * count
            const item = recipe.result.item

            return {
                key: 'craft/message/crafted',
                vars: {
                    item: item.getVars(ctx),
                    count: totalCount
                }
            }
        }

        return {
            key: `craft/cant/${reason}`
        }
    }
}

export default new CraftButton()