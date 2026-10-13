import type InventoryItem from "../../db/entities/items/InventoryItem"
import type { RecipeMaterial } from "../../types/recipes"
import ExperienceUtils from "../level/ExperienceUtils"

type ConstructorOptions =
    & Pick<Recipe, 'level' | 'experience' | 'materials' | 'result' | 'id'>

export default class Recipe {
    id: number
    level: number
    experience: number
    materials: RecipeMaterial[]
    result: RecipeMaterial

    constructor({
        level,
        experience,
        materials,
        result,
        id
    }: ConstructorOptions) {
        this.id = id
        this.level = level
        this.experience = experience
        this.materials = materials
        this.result = result
    }

    getExperience(inventory: InventoryItem[], count: number): number {
        const experience = this.experience
        const boost = ExperienceUtils.getBoost(inventory)
        return Math.ceil(boost * experience * count)
    }
}