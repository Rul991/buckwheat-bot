import { runBot } from "./bot"
import { DB_URL, IS_PROD } from "../consts/env"
import { mongoose } from "@typegoose/typegoose"
import Logger from "../utils/logs/Logger"
import ItemUtils from "../utils/items/ItemUtils"
import { inventoryItems } from "../resources/items/inventory"
import FaqUtils from "../utils/faq/FaqUtils"
import SkillRegistry from "../utils/duel/skill/SkillRegistry"
import { skills } from "../resources/duels/skills/skills"
import RecipeUtils from "../utils/recipes/RecipeUtils"
import { recipes } from "../resources/recipes/recipes"
import { effects } from "../resources/duels/skills/effects"

const connectDatabase = async () => {
    await mongoose.connect(DB_URL)
    mongoose.set(
        'debug',
        (collectionName, method, ...options) => {
            Logger.system(collectionName, method, ...options)
        }
    )
}

const setup = async () => {
    return await Promise.all([
        ItemUtils.setup(inventoryItems),
        FaqUtils.setup(),
        SkillRegistry.setup(...skills, ...effects),
        RecipeUtils.setup(recipes)
    ])
}

const dev = async (): Promise<boolean | void> => {
    
}

const main = async () => {
    Logger.log('[db] connecting')
    await connectDatabase()
    Logger.log('[db] connected')

    await setup()
    if (IS_PROD || (await dev() ?? true)) {
        Logger.log('[bot] starting')
        await runBot()
    }
}

await main()