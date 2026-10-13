import Recipe from "../../utils/recipes/Recipe"
import { craftWorkUpItem, glassItem, lootboxItem, lootboxMaterialItem, metalItem, pistolAmmoItem, stringsItem, valGiftItem, valLeafItem, woodItem, woodSwordItem } from "../items/inventory"

export const craftWorkUpRecipe = new Recipe({
    id: 0,
    level: 10,
    experience: 25,
    materials: [
        {
            item: glassItem,
            count: 1
        },
        {
            item: metalItem,
            count: 2
        },
        {
            item: woodItem,
            count: 3
        }
    ],
    result: {
        item: craftWorkUpItem,
        count: 1
    }
})

export const pistolAmmoRecipe = new Recipe({
    id: 1,
    level: 5,
    experience: 1,
    materials: [
        {
            item: metalItem,
            count: 2
        }
    ],
    result: {
        item: pistolAmmoItem,
        count: 10
    }
})

export const valGiftRecipe = new Recipe({
    id: 2,
    level: 1,
    experience: 100,
    materials: [
        {
            item: stringsItem,
            count: 5
        },
        {
            item: valLeafItem,
            count: 1
        },
        {
            item: woodItem,
            count: 3
        }
    ],
    result: {
        item: valGiftItem,
        count: 1
    }
})

export const woodSwordRecipe = new Recipe({
    id: 3,
    level: 1,
    experience: 7,
    materials: [
        {
            item: woodItem,
            count: 7
        }
    ],
    result: {
        item: woodSwordItem,
        count: 1
    }
})

export const lootboxRecipe = new Recipe({
    id: 4,
    level: 7,
    experience: 500,
    materials: [
        {
            item: lootboxMaterialItem,
            count: 32
        }
    ],
    result: {
        item: lootboxItem,
        count: 1
    }
})

export const recipes: Recipe[] = [
    craftWorkUpRecipe,
    pistolAmmoRecipe,
    valGiftRecipe,
    woodSwordRecipe,
    lootboxRecipe
]