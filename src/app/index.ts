import { runBot } from "./bot"
import { DB_URL, IS_PROD } from "../consts/env"
import { mongoose } from "@typegoose/typegoose"
import Logger from "../utils/logs/Logger"
import ItemUtils from "../utils/items/ItemUtils"
import { inventoryItems } from "../resources/items/inventory"
import FaqUtils from "../utils/faq/FaqUtils"

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
        FaqUtils.setup()
    ])
}

const test = async (): Promise<boolean | void> => {
    
}

const main = async () => {
    Logger.log('[db] connecting')
    await connectDatabase()
    Logger.log('[db] connected')

    await setup()
    if (IS_PROD || (await test() ?? true)) {
        Logger.log('[bot] starting')
        await runBot()
    }
}

await main()