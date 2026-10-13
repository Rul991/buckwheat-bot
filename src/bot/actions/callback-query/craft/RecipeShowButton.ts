import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type RecipeShowButtonData, RecipeShowButtonDataSchema } from "../../../../protos/recipe_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RecipeUtils from "../../../../utils/recipes/RecipeUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class RecipeShowButton extends CallbackQueryAction<RecipeShowButtonData> {
    override schema: GenMessage<RecipeShowButtonData> = RecipeShowButtonDataSchema
    override defaultTextKey: string = 'craft/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 122
    override name: string = 'rsh'

    protected override async _getId(options: CallbackQueryActionOptions<RecipeShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<RecipeShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx
        } = options

        const {
            recipeId,
            count,
            page
        } = data

        const recipe = RecipeUtils.get(recipeId)
        if(!recipe) return

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
    }
}

export default new RecipeShowButton()