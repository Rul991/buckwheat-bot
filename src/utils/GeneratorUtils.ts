import GeneratorsService from '../classes/db/services/generators/GeneratorsService'
import Generators from '../interfaces/schemas/generator/Generators'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import { GENERATOR_MAX_LEVEL, GENERATOR_UPGRADE_PRICE_PER_LEVEL } from './values/consts'

type GetMessageOptions = {
    chatId: number
    id: number
    generator: Generators
}

type UpgradeResult = {
    price: number,
    level: number
}

export default class {
    static async getInfoMessage({
        chatId,
        id,
        generator
    }: GetMessageOptions) {
        const incomePerHour = await GeneratorsService.getIncomePerHour(generator)
        const income = await GeneratorsService.getIncome(chatId, id)
        const {
            generators
        } = generator

        return await FileUtils.readPugFromResource(
            'text/commands/generator/info.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, id),
                    incomePerHour,
                    generatorCount: generators.length,
                    income
                }
            }
        )
    }

    static getPrice(current: number, next: number) {
        let result = 0

        for (let i = current; i < next; i++) {
            result += i * GENERATOR_UPGRADE_PRICE_PER_LEVEL
        }

        return result
    }

    static getUpgradeLevels(current: number) {
        const result: UpgradeResult[] = []

        for (let i = current + 1; i <= GENERATOR_MAX_LEVEL; i++) {
            result.push(
                {
                    level: i,
                    price: this.getPrice(current, i)
                }
            )
        }

        return result
    }
}