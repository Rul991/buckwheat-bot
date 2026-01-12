import GeneratorsService from '../classes/db/services/generators/GeneratorsService'
import Generators from '../interfaces/schemas/generator/Generators'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'

type GetMessageOptions = {
    chatId: number
    id: number
    generator: Generators
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
}