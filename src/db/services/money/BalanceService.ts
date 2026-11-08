import type { QueryFilter } from "mongoose"
import { START_MONEY } from "../../../consts/number"
import Balance from "../../entities/money/Balance"
import BaseService from "../base/BaseService"
import type BusinessStock from "../../entities/business/BusinessStock"

type AddOptions = {
    chatId: number
    id: number
    money: number
}

type ChangeOptions = AddOptions
type TransferOptions = {
    chatId: number
    owner: number
    target: number
    money: number
}

type Income = {
    chatId: number
    id: number
    income: number
}

class BalanceService extends BaseService<typeof Balance> {
    constructor() {
        super(Balance)
    }

    private async _getTotalSum(filter: QueryFilter<Balance>): Promise<number> {
        const [result] = await this._repo.model.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ])
        return result?.total ?? 0
    }

    override async create(balance: Balance): Promise<Balance> {
        return await this._repo.getOrCreate(
            {
                id: balance.id,
                chatId: balance.chatId,
            },
            balance
        )
    }

    async add(options: AddOptions): Promise<Balance> {
        const {
            chatId,
            id,
            money,
        } = options

        return (await this._repo.model.findOneAndUpdate(
            { chatId, id },
            [
                {
                    $set: {
                        total: {
                            $add: [
                                { $ifNull: ['$total', START_MONEY] },
                                money
                            ]
                        }
                    }
                }
            ],
            { upsert: true, lean: true, returnDocument: 'after', updatePipeline: true }
        ).exec())!
    }

    async trySpend({ chatId, id, money }: ChangeOptions): Promise<Balance | undefined> {
        if (money <= 0) return await this.get(chatId, id)

        return (await this._repo.model.findOneAndUpdate(
            { chatId, id, total: { $gte: money } },
            { $inc: { total: -money } },
            { lean: true, returnDocument: 'after' }
        ).exec()) ?? undefined
    }

    async get(chatId: number, id: number): Promise<Balance> {
        return await this.create(Balance.default(chatId, id))
    }

    async getMoney(chatId: number, id: number): Promise<number> {
        return (await this.get(chatId, id))?.total ?? 0
    }

    async getAllByChatId(chatId: number): Promise<Balance[]> {
        return await this._repo.find({
            chatId,
        })
    }

    async getTotalSumByStocks(stocks: BusinessStock[]) {
        return await this._getTotalSum({
            $or: stocks.map(v => {
                return {
                    chatId: v.chatId,
                    id: v.id
                }
            })
        })
    }

    async getEnvellBalance(): Promise<number> {
        return await this._getTotalSum({})
    }

    async transfer({ chatId, owner, target, money }: TransferOptions): Promise<boolean> {
        if (money <= 0 || owner === target) return true

        const spent = await this.trySpend({ chatId, id: owner, money })
        if (!spent) return false

        await this.add({ chatId, id: target, money })
        return true
    }

    async addMany(incomes: Income[]) {
        const result = await this._repo.model.bulkWrite(
            incomes.map(v => {
                return {
                    updateOne: {
                        filter: {
                            chatId: v.chatId,
                            id: v.id
                        },
                        update: {
                            $inc: {
                                total: v.income
                            }
                        },
                        upsert: true,
                        setDefaultsOnInsert: true
                    }
                }
            })
        )
        return result.isOk()
    }
}

export default new BalanceService()