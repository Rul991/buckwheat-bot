import Generators from '../../../../interfaces/schemas/generator/Generators'
import MoneyGenerator from '../../../../interfaces/schemas/generator/MoneyGenerator'
import GeneratorUtils from '../../../../utils/GeneratorUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { GENERATOR_INCOME_PER_HOUR, GENERATOR_UPGRADE_PRICE_PER_LEVEL, GENERATOR_MAX_COUNT, MILLISECONDS_IN_HOUR, NOT_FOUND_INDEX, GENERATOR_MAX_LEVEL, GENERATOR_MIN_LEVEL } from '../../../../utils/values/consts'
import { Ids } from '../../../../utils/values/types/types'
import GeneratorsRepository from '../../repositories/GeneratorsRepository'
import CasinoAddService from '../casino/CasinoAddService'
import CasinoGetService from '../casino/CasinoGetService'
import InventoryItemService from '../items/InventoryItemService'

type GeneratorResult = {
    done: boolean
    reason: string,
    count?: number
}

type UpgradeOptions = Omit<UpgradeAllOptions, 'generators'> & {
    generatorId: number
}

type UpgradeAllOptions = Ids & {
    generators?: number[]
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

        const [grindDeviceUsed] = await InventoryItemService.use({
            chatId,
            id,
            itemId,
            count
        })

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

    static async getTotalUpgradePrice(
        chatId: number,
        id: number,
        level = GENERATOR_MAX_LEVEL
    ) {
        let result = 0
        const {
            generators
        } = await this.get(chatId, id)

        for (const { level: generatorLevel } of generators) {
            const price = GeneratorUtils.getPrice(
                generatorLevel,
                level,
            )
            result += price
        }

        return result
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

    static async upgradeAll({
        chatId,
        id,
        generators: generatorIds,
        level = GENERATOR_MAX_LEVEL
    }: UpgradeAllOptions): Promise<GeneratorResult[]> {
        const {
            generators
        } = await this.get(chatId, id)
        const usedGeneratorIds = generatorIds ??
            generators.map(({ id }) => id)

        if (level > GENERATOR_MAX_LEVEL) {
            return usedGeneratorIds.map(_ => {
                return {
                    done: false,
                    reason: 'max-level'
                }
            })
        }

        const usedGenerators = usedGeneratorIds.map(id => {
            return generators[id]
        })
        const result: GeneratorResult[] = []
        const money = await CasinoGetService.money(chatId, id)
        let totalPrice = 0

        for (const generator of usedGenerators) {
            if (!generator) {
                result.push({
                    done: false,
                    reason: 'no-generator'
                })
                continue
            }

            if(generator.level >= level) {
                result.push({
                    done: false,
                    reason: 'already-upgraded'
                })
                continue
            }

            const price = GeneratorUtils.getPrice(
                generator.level,
                level
            )

            if (totalPrice + price > money) {
                result.push({
                    done: false,
                    reason: 'not-enough-money'
                })
                continue
            }

            totalPrice += price
            generator.level = level

            result.push({
                done: true,
                reason: 'upgraded'
            })
        }

        await CasinoAddService.money(chatId, id, -totalPrice)
        await GeneratorsRepository.updateOne(
            chatId,
            id,
            {
                generators: [...generators]
            }
        )

        return result
    }

    static async upgrade({
        chatId,
        id,
        level,
        generatorId
    }: UpgradeOptions): Promise<GeneratorResult> {
        const [result] = await this.upgradeAll({
            chatId,
            id,
            level,
            generators: [
                generatorId
            ]
        })

        return result
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