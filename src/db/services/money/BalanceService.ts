import type { BalanceType } from "../../../types/db"
import Balance from "../../entities/money/Balance"
import BaseService from "../base/BaseService"

type AddOptions = {
    chatId: number
    id: number
    owner?: number
    money: number
    type?: BalanceType
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
                type: balance.type
            },
            balance
        )
    }

    async add(options: AddOptions): Promise<Balance | undefined> {
        const {
            chatId,
            id,
            owner = id,
            money,
            type = 'user'
        } = options
        if (money == 0) return undefined

        await this.create(Balance.default(chatId, id, type))
        return await this._repo.updateOne(
            {
                chatId,
                id,
                type,
            },
            [
                {
                    $set: {
                        total: { $add: ['$total', money] },
                        owners: {
                            $let: {
                                vars: {
                                    existing: { $ifNull: ['$owners', []] }
                                },
                                in: {
                                    $cond: [
                                        {
                                            $in: [
                                                owner,
                                                {
                                                    $map: {
                                                        input: '$$existing',
                                                        as: 'o',
                                                        in: '$$o.id'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            $map: {
                                                input: '$$existing',
                                                as: 'o',
                                                in: {
                                                    $cond: [
                                                        { $eq: ['$$o.id', owner] },
                                                        {
                                                            $mergeObjects: [
                                                                '$$o',
                                                                { stake: { $add: ['$$o.stake', money] } }
                                                            ]
                                                        },
                                                        '$$o'
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $concatArrays: [
                                                '$$existing',
                                                [{ id: owner, stake: money }]
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        )
    }

    async getUserBalance(chatId: number, id: number): Promise<Balance | undefined> {
        return await this.create(Balance.user(chatId, id))
    }

    async getAllByChatIdType(chatId: number, type: BalanceType = 'user'): Promise<Balance[]> {
        return await this._repo.find({
            chatId,
            type
        })
    }

    async getEnvellBalance(): Promise<number> {
        const result = await this._repo.model.aggregate([
            { $group: { _id: null, totalMoney: { $sum: "$total" } } }
        ])
        return result.length ? result[0].totalMoney : 0
    }
}

export default new BalanceService()