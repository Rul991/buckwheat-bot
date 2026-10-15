import { GENERATOR_COUNT_PER_LICENSE, GENERATOR_UPGRADE_PRICE, LEVEL_PER_GENERATOR } from "../../../consts/generator"
import { moneyGeneratorItem, moneyGenLicenseItem } from "../../../resources/items/inventory"
import GeneratorUtils from "../../../utils/generator/GeneratorUtils"
import Generator from "../../entities/generator/Generator"
import BaseService from "../base/BaseService"
import InventoryItemService from "../items/InventoryItemService"
import BalanceService from "../money/BalanceService"

type AddResult = {
    ok: boolean
    reason: string
    count: number
}

type UpgradeInfo = {
    levels: number
    price: number
}

class GeneratorService extends BaseService<typeof Generator> {
    constructor() {
        super(Generator)
    }

    override async create(obj: Generator): Promise<Generator> {
        return this._repo.getOrCreate(
            {
                chatId: obj.chatId,
                id: obj.id
            },
            obj
        )
    }

    async get(chatId: number, id: number): Promise<Generator> {
        return await this.create(
            new Generator({
                chatId,
                id
            })
        )
    }

    async getMaxGeneratorsCount(chatId: number, id: number): Promise<number> {
        const licenses = await InventoryItemService.getCountByUser({
            chatId,
            id,
            item: moneyGenLicenseItem
        })

        const maxGeneratorsCount = licenses * GENERATOR_COUNT_PER_LICENSE
        return maxGeneratorsCount
    }

    async getMaxLevel(chatId: number, id: number): Promise<number> {
        const maxGeneratorsCount = await this.getMaxGeneratorsCount(chatId, id)
        return GeneratorUtils.getMaxLevel(maxGeneratorsCount)
    }

    async getAvailableGenerators(chatId: number, id: number): Promise<number> {
        const generator = await this.get(chatId, id)
        const generators = await InventoryItemService.getCountByUser({
            chatId,
            id,
            item: moneyGeneratorItem
        })
        const maxGeneratorsCount = await this.getMaxGeneratorsCount(chatId, id)

        return Math.min(
            maxGeneratorsCount - generator.generatorCount,
            generators
        )
    }

    async add(chatId: number, id: number): Promise<AddResult> {
        const generator = await this.get(chatId, id)
        const generators = await InventoryItemService.getCountByUser({
            chatId,
            id,
            item: moneyGeneratorItem
        })
        if (generators <= 0) {
            return {
                ok: false,
                reason: 'no-generators',
                count: 0
            }
        }

        const maxGeneratorsCount = await this.getMaxGeneratorsCount(chatId, id)
        if (maxGeneratorsCount <= 0) {
            return {
                ok: false,
                reason: 'no-license',
                count: 0
            }
        }

        const remainingGeneratorsCount = Math.min(
            maxGeneratorsCount - generator.generatorCount,
            generators
        )
        if (remainingGeneratorsCount <= 0) {
            return {
                ok: false,
                reason: 'too-many-generators',
                count: 0
            }
        }

        const removeResult = await InventoryItemService.remove({
            chatId,
            id,
            item: moneyGeneratorItem,
            count: remainingGeneratorsCount
        })

        if (!removeResult.ok) {
            return {
                ok: false,
                reason: 'no-generators',
                count: 0
            }
        }

        await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                $inc: {
                    levels: remainingGeneratorsCount,
                    generatorCount: remainingGeneratorsCount
                }
            }
        )

        return {
            ok: true,
            reason: 'done',
            count: remainingGeneratorsCount
        }
    }

    async getIncome(chatId: number, id: number): Promise<number> {
        const generator = await this.get(chatId, id)
        const maxLevel = await this.getMaxLevel(chatId, id)
        return GeneratorUtils.getIncome(generator, maxLevel)
    }

    async collect(chatId: number, id: number): Promise<number> {
        const income = await this.getIncome(chatId, id)
        if (income > 0) {
            await Promise.all([
                BalanceService.add({
                    chatId,
                    id,
                    money: income
                }),
                this._repo.updateOne(
                    {
                        chatId,
                        id
                    },
                    {
                        updatedAt: new Date()
                    }
                )
            ])
        }

        return income
    }

    async getUpgradeInfo(chatId: number, id: number): Promise<UpgradeInfo> {
        const generator = await this.get(chatId, id)
        const maxLevels = generator.generatorCount * LEVEL_PER_GENERATOR
        const remainingLevels = maxLevels - generator.levels

        if (remainingLevels <= 0) {
            return {
                levels: 0,
                price: 0
            }
        }

        const money = await BalanceService.getMoney(chatId, id)
        const affordableLevels = Math.floor(money / GENERATOR_UPGRADE_PRICE)
        const levels = Math.min(remainingLevels, affordableLevels)

        return {
            levels,
            price: levels * GENERATOR_UPGRADE_PRICE
        }
    }

    async upgrade(chatId: number, id: number): Promise<AddResult> {
        const generator = await this.get(chatId, id)

        if (generator.generatorCount <= 0) {
            return {
                ok: false,
                reason: 'no-generators',
                count: 0
            }
        }

        const maxLevels = generator.generatorCount * LEVEL_PER_GENERATOR
        if (generator.levels >= maxLevels) {
            return {
                ok: false,
                reason: 'max-level',
                count: 0
            }
        }

        const { levels, price } = await this.getUpgradeInfo(chatId, id)

        if (levels <= 0) {
            return {
                ok: false,
                reason: 'not-enough-money',
                count: 0
            }
        }

        const balance = await BalanceService.trySpend({
            chatId,
            id,
            money: price
        })

        if (!balance) {
            return {
                ok: false,
                reason: 'not-enough-money',
                count: 0
            }
        }

        await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                $inc: {
                    levels
                }
            }
        )

        return {
            ok: true,
            reason: 'done',
            count: levels
        }
    }
}

export default new GeneratorService()