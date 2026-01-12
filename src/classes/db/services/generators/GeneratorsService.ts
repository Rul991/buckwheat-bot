import Generators from '../../../../interfaces/schemas/generator/Generators'
import TimeUtils from '../../../../utils/TimeUtils'
import { GENERATOR_INCOME_PER_HOUR, GENERATOR_UPGRADE_PRICE_PER_LEVEL, GENERATOR_MAX_COUNT, MILLISECONDS_IN_HOUR, NOT_FOUND_INDEX, GENERATOR_MAX_LEVEL } from '../../../../utils/values/consts'
import GeneratorsRepository from '../../repositories/GeneratorsRepository'
import CasinoAddService from '../casino/CasinoAddService'
import CasinoGetService from '../casino/CasinoGetService'
import InventoryItemService from '../items/InventoryItemService'

type GeneratorResult = {
    done: boolean
    reason: string
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
            generators
        } = await this.get(chatId, id)

        if (generators.length >= GENERATOR_MAX_COUNT) {
            return {
                done: false,
                reason: 'many-generators'
            }
        }

        const itemId = 'moneyGrindDevice'
        const [grindDeviceUsed] = await InventoryItemService.use(
            chatId,
            id,
            itemId
        )

        if (!grindDeviceUsed) {
            return {
                done: false,
                reason: 'no-devices'
            }
        }

        await GeneratorsRepository.updateOne(
            chatId,
            id,
            {
                generators: [
                    ...generators,
                    {
                        level: 1,
                        id: generators.length
                    }
                ]
            }
        )

        return {
            done: true,
            reason: 'added'
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

    static async getPriceForUpgrade(chatId: number, id: number, generatorId: number) {
        const {
            generators
        } = await this.get(chatId, id)

        const generator = generators[generatorId]
        if (!generator) return NOT_FOUND_INDEX

        const {
            level
        } = generator

        return GENERATOR_UPGRADE_PRICE_PER_LEVEL * level
    }

    static async upgrade(chatId: number, id: number, generatorId: number): Promise<GeneratorResult> {
        const {
            generators
        } = await this.get(chatId, id)

        if (generators[generatorId].level >= GENERATOR_MAX_LEVEL) {
            return {
                done: false,
                reason: 'max-level'
            }
        }

        const price = await this.getPriceForUpgrade(chatId, id, generatorId)
        if (price === NOT_FOUND_INDEX) {
            return {
                done: false,
                reason: 'no-generator'
            }
        }

        const money = await CasinoGetService.money(chatId, id)
        if (price > money) {
            return {
                done: false,
                reason: 'not-enough-money'
            }
        }

        generators[generatorId].level++

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
}