import { MAX_BUSINESS_STAKES } from "../../../consts/number"
import BusinessStock from "../../entities/business/BusinessStock"
import BaseService from "../base/BaseService"
import BalanceService from "../money/BalanceService"

type GetOptions = {
    chatId: number
    id: number
    businessId: number
}

type AddOptions =
    & GetOptions
    & {
        stocks: number
    }

class BusinessStockService extends BaseService<typeof BusinessStock> {
    constructor() {
        super(BusinessStock)
    }

    override async create(obj: BusinessStock): Promise<BusinessStock> {
        const {
            chatId,
            id,
            businessId
        } = obj
        return await this._repo.getOrCreate(
            {
                chatId,
                id,
                businessId
            },
            obj
        )
    }

    async add({
        chatId,
        id,
        businessId,
        stocks
    }: AddOptions) {
        return (await this._repo.updateOne(
            {
                chatId,
                id,
                businessId
            },
            {
                $inc: {
                    count: stocks,
                    totalIncome: 0
                }
            },
            true
        ))!
    }

    async get(filter: GetOptions) {
        return await this._repo.findOne({
            ...filter,
            count: {
                $gt: 0
            }
        })
    }

    async getAllByUser(chatId: number, id: number) {
        return await this._repo.find({
            chatId,
            id
        })
    }

    async income(businessId: number, money: number) {
        let currentMoney = money
        const stocks = await this._repo.find({
            businessId
        })

        const incomes = stocks
            .sort((a, b) => a.count - b.count)
            .map((v, i) => {
                const income = Math.floor(
                    i < stocks.length - 1 ?
                        v.count / MAX_BUSINESS_STAKES * currentMoney :
                        currentMoney
                )
                currentMoney -= income

                return {
                    chatId: v.chatId,
                    id: v.id,
                    income
                }
            })

        await Promise.all([
            BalanceService.addMany(incomes),
            this._repo.model.bulkWrite(
                incomes.map(v => {
                    return {
                        updateOne: {
                            filter: {
                                chatId: v.chatId,
                                id: v.id,
                                businessId
                            },
                            update: {
                                $inc: {
                                    totalIncome: v.income
                                }
                            }
                        }
                    }
                })
            )
        ])
    }
}

export default new BusinessStockService()