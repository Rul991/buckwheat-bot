import FileUtils from './FileUtils'
import { Recipe } from './values/types/recipes'
import ObjectValidator from './ObjectValidator'
import { recipeSchema } from './values/schemas'
import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import InventoryItemsUtils from './InventoryItemsUtils'

type CraftResult =
    | {
        resultMaterials: Recipe['materials']
        done: true
    }
    | {
        done: false
        reason: string
    }

export default class {
    private static _recipes: Recipe[] = []

    private static _checkMaterials(
        items: InventoryItem[], 
        materials: Recipe['materials'],
        chosenCount: number
    ): null | Recipe['materials'] {
        const result: Recipe['materials'] = {}

        for (const [materialId, rawMaterialCount] of Object.entries(materials)) {
            const inventoryItem = InventoryItemsUtils.find(
                items,
                materialId
            )
            if(!inventoryItem) return null

            const inventoryCount = (inventoryItem.count ?? 0)
            const recipeCount = rawMaterialCount * chosenCount
            if(inventoryCount < recipeCount) return null

            result[materialId] = recipeCount
        }

        return result
    }

    static async setup() {
        const files = await FileUtils.readFilesFromResourse(
            'json/recipes'
        )

        for (const filename of files) {
            const recipe = await FileUtils.readJsonFromResource<Recipe>(
                `json/recipes/${filename}`
            )

            if (!ObjectValidator.isValidatedObject(
                recipe,
                recipeSchema
            )) continue

            this._recipes.push(recipe)
        }

        this._recipes.sort((a, b) => {
            return a.level - b.level
        })
    }

    static getDummy(): Recipe {
        return {
            materials: {
                
            },
            result: {
                name: '',
                count: 0
            },
            level: 100
        }
    }

    static getAll() {
        return this._recipes
    }

    static get(index: number): Recipe {
        return this._recipes[index] ?? this.getDummy()
    }

    static craft(items: InventoryItem[], materials: Recipe['materials'], chosenCount = 1): CraftResult {
        const resultMaterials = this._checkMaterials(
            items,
            materials,
            chosenCount
        )

        if(!resultMaterials) {
            return {
                done: false,
                reason: 'low-materials'
            }
        }

        return {
            done: true,
            resultMaterials
        }
    }
}