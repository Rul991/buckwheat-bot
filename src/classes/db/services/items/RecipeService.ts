import RecipeUtils from '../../../../utils/RecipeUtils'
import ExperienceService from '../level/ExperienceService'
import LevelService from '../level/LevelService'
import UserClassService from '../user/UserClassService'
import InventoryItemService from './InventoryItemService'

type CraftOptions = {
    chatId: number
    id: number
    index: number
    count?: number
}

type CraftResult = {
    done: boolean
    reason: string
}

export default class {
    static async getAvailable(
        chatId: number,
        id: number
    ) {
        const recipes = RecipeUtils.getAll()
        if(!recipes.length) return []

        const level = await LevelService.get(chatId, id)
        return recipes.filter(
            v => level >= v.level
        )
    }

    static async craft({
        chatId,
        id,
        index,
        count: chosenCount = 1
    }: CraftOptions): Promise<CraftResult> {
        const items = await InventoryItemService.getAll(
            chatId,
            id
        )
        const recipe = RecipeUtils.get(index)
        
        if (!recipe) {
            return {
                done: false,
                reason: 'no-recipe'
            }
        }

        const {
            level: recipeLevel,
            materials,
            result: {
                name: recipeName,
                count = 1
            }
        } = recipe

        const className = await UserClassService.get(chatId, id)
        if(className != 'engineer') {
            return {
                done: false,
                reason: 'not-engineer'
            }
        }
        
        const level = await LevelService.get(chatId, id)
        if (recipeLevel > level) {
            return {
                done: false,
                reason: 'low-level'
            }
        }

        const craftResult = RecipeUtils.craft(
            items,
            materials,
            chosenCount
        )

        const {
            done
        } = craftResult

        if(done) {
            const {
                resultMaterials
            } = craftResult

            const {
                experience
            } = recipe

            await InventoryItemService.useMany({
                chatId,
                id,
                materials: resultMaterials
            })

            await InventoryItemService.add({
                chatId,
                id,
                itemId: recipeName,
                count: count * chosenCount
            })
            await ExperienceService.add(
                chatId,
                id,
                experience
            )

            return {
                done: true,
                reason: 'crafted'
            }
        }
        else {
            return craftResult
        }
    }
}