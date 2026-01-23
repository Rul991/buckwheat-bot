import Generators from '../../../../interfaces/schemas/generator/Generators'
import MoneyGenerator from '../../../../interfaces/schemas/generator/MoneyGenerator'
import GeneratorUtils from '../../../../utils/GeneratorUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { GENERATOR_INCOME_PER_HOUR, GENERATOR_UPGRADE_PRICE_PER_LEVEL, GENERATOR_MAX_COUNT, MILLISECONDS_IN_HOUR, NOT_FOUND_INDEX, GENERATOR_MAX_LEVEL, GENERATOR_MIN_LEVEL } from '../../../../utils/values/consts'
import GeneratorsRepository from '../../repositories/GeneratorsRepository'
import CasinoAddService from '../casino/CasinoAddService'
import CasinoGetService from '../casino/CasinoGetService'
import InventoryItemService from '../items/InventoryItemService'

type GeneratorResult = {
    done: boolean
    reason: string,
    count?: number
}

type UpgradeOptions = {
    chatId: number
    id: number
    generatorId: number
    level: number
}

export default class {
    static async get(chatId: number, id: number): Promise<Generators> {
        return await GeneratorsRepository.getOrCreate(
            chatId,
            id,
            {
                chatId,
                id,
                lastCheckTime: Date.now(),
                generators: []
            }
        )
    }

    static async add(chatId: number, id: number): Promise<GeneratorResult> {
        const {
            generators,
            lastCheckTime
        } = await this.get(chatId, id)
        const generatorsLength = generators.length

        if (generatorsLength >= GENERATOR_MAX_COUNT) {
            return {
                done: false,
                reason: 'many-generators'
            }
        }

        const itemId = 'moneyGrindDevice'
        const rawCount = await InventoryItemService.getCount(
            chatId,
            id,
            itemId
        )
        const count = Math.min(
            Math.max(0, GENERATOR_MAX_COUNT - generatorsLength), 
            rawCount
        )
        
        const [grindDeviceUsed] = await InventoryItemService.use(
            chatId,
            id,
            itemId,
            count
        )

        if (!grindDeviceUsed) {
            return {
                done: false,
                reason: 'no-devices'
            }
        }

        const newGenerators: MoneyGenerator[] = []

        for (let i = 0; i < count; i++) {
            const level = GENERATOR_MIN_LEVEL
            const id = generatorsLength + i

            newGenerators.push({
                level,
                id
            })
        }

        await GeneratorsRepository.updateOne(
            chatId,
            id,
            {
                generators: [
                    ...generators,
                    ...newGenerators
                ],
                lastCheckTime: generatorsLength <= 0 ? Date.now() : lastCheckTime
            }
        )

        return {
            done: true,
            reason: 'added',
            count
        }
    }

    static async getIncomePerHour(generator: Generators): Promise<number> {
        const {
            generators
        } = generator

        const totalLevels = generators.reduce(
            (prev, curr) => prev + curr.level,
            0
        )

        return totalLevels * GENERATOR_INCOME_PER_HOUR
    }

    static async getIncome(chatId: number, id: number) {
        const generator = await this.get(chatId, id)
        const {
            lastCheckTime
        } = generator

        const incomePerHour = await this.getIncomePerHour(generator)
        const elapsedMilliseconds = TimeUtils.getElapsed(lastCheckTime)
        const elapsedHours = elapsedMilliseconds / MILLISECONDS_IN_HOUR
        const money = Math.floor(incomePerHour * elapsedHours)

        return money
    }

    static async collectIncome(chatId: number, id: number) {
        const money = await this.getIncome(chatId, id)

        if (money > 0) {
            await CasinoAddService.money(chatId, id, money)
            await GeneratorsRepository.updateOne(
                chatId,
                id,
                {
                    lastCheckTime: Date.now()
                }
            )
        }

        return money
    }

    static async upgrade({
        chatId,
        id,
        level,
        generatorId
    }: UpgradeOptions): Promise<GeneratorResult> {
        const {
            generators
        } = await this.get(chatId, id)

        if (!generators[generatorId]) {
            return {
                done: false,
                reason: 'no-generator'
            }
        }

        if (level > GENERATOR_MAX_LEVEL) {
            return {
                done: false,
                reason: 'max-level'
            }
        }

        const price = GeneratorUtils.getPrice(
            generators[generatorId].level,
            level
        )

        const money = await CasinoGetService.money(chatId, id)
        if (price > money) {
            return {
                done: false,
                reason: 'not-enough-money'
            }
        }

        generators[generatorId].level = level

        await CasinoAddService.money(chatId, id, -price)
        await GeneratorsRepository.updateOne(
            chatId,
            id,
            {
                generators: [...generators]
            }
        )

        return {
            done: true,
            reason: 'upgraded'
        }
    }

    static async wipe(chatId: number) {
        return await GeneratorsRepository.updateMany(
            chatId,
            {
                $set: {
                    generators: []
                }
            }
        )
    }
}