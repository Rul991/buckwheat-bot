import { showRecipeKeyboard } from "../../bot/keyboards/recipe"
import InventoryItemService from "../../db/services/items/InventoryItemService"
import type { BotContext } from "../../types/bot"
import ExperienceUtils from "../level/ExperienceUtils"
import type Recipe from "./Recipe"

type ShowOptions = {
    ctx: BotContext
    recipe: Recipe
    count: number
    page: number
}

export default class RecipeUtils {
    private static _recipes: Map<number, Recipe> = new Map()

    static setup(recipes: Recipe[]) {
        for (const recipe of recipes) {
            this._recipes.set(
                recipe.id,
                recipe
            )
        }
    }

    static get(id: number) {
        return this._recipes.get(id)
    }

    static getAll(): Recipe[] {
        return this._recipes
            .values()
            .toArray()
            .toSorted(
                (a, b) => a.level - b.level
            )
    }

    static async show({
        ctx,
        recipe,
        count,
        page
    }: ShowOptions) {
        const id = ctx.vars.id
        const chatId = ctx.vars.chatId!

        const levelObject = await ctx.vars.level.get()
        const level = ExperienceUtils.getLevelFromObject(levelObject)

        const inventory = await InventoryItemService.getInventory(chatId, id)
        const experience = recipe.getExperience(inventory, count)

        const resultItem = recipe.result.item
        const recipeLevel = recipe.level

        const materials = recipe.materials.map(material => {
            return {
                item: material.item.getVars(ctx),
                needCount: material.count * count,
                currentCount: inventory.find(v => v.itemId == material.item.id)?.count ?? 0
            }
        })

        return {
            key: 'craft/message/show',
            options: {
                vars: {
                    recipe,
                    experience,
                    level: recipeLevel,
                    resultItem: resultItem.getVars(ctx),
                    count,
                    materials,
                    inventoryItem: {
                        count: inventory.find(v => v.itemId == resultItem.id)?.count ?? 0
                    }
                },
                keyboard: await showRecipeKeyboard(
                    ctx,
                    {
                        id,
                        recipe,
                        page,
                        count,
                        level,
                    }
                )
            }
        } as const
    }
}