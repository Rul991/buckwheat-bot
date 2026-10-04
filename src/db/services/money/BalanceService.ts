import { START_MONEY } from "../../../consts/number"
import Balance from "../../entities/money/Balance"
import BaseService from "../base/BaseService"

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

class BalanceService extends BaseService<typeof Balance> {
    constructor() {
        super(Balance)
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

    async get(chatId: number, id: number): Promise<Balance | undefined> {
        return await this.create(Balance.default(chatId, id))
    }

    async getAllByChatId(chatId: number): Promise<Balance[]> {
        return await this._repo.find({
            chatId,
        })
    }

    async getEnvellBalance(): Promise<number> {
        const result = await this._repo.model.aggregate([
            { $group: { _id: null, totalMoney: { $sum: "$total" } } }
        ])
        return result.length ? result[0].totalMoney : 0
    }

    async transfer({ chatId, owner, target, money }: TransferOptions): Promise<boolean> {
        if (money <= 0 || owner === target) return false

        const spent = await this.trySpend({ chatId, id: owner, money })
        if (!spent) return false

        await this.add({ chatId, id: target, money })
        return true
    }
}

export default new BalanceService()