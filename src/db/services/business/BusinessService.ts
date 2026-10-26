import { BUCKWHEAT_STAKE_PRICE, MAX_BUSINESS_STAKES } from "../../../consts/number"
import type { BuckwheatBusinessOptions, BusinessType } from "../../../types/business"
import Business from "../../entities/business/Business"
import BusinessStock from "../../entities/business/BusinessStock"
import BusinessStockMarketSlot from "../../entities/business/BusinessStockMarketSlot"
import BaseService from "../base/BaseService"
import BusinessStockMarketSlotService from "./BusinessStockMarketSlotService"
import BusinessStockService from "./BusinessStockService"

type GetBuckwheatOptions = {
    chatId: number
    id: number
    type: BusinessType
}

class BusinessService extends BaseService<typeof Business> {
    constructor() {
        super(Business)
    }

    async createBuckwheat(options: BuckwheatBusinessOptions) {
        const {
            type,
            ctx
        } = options
        const owner = ctx.me.id
        const chatId = ctx.vars.chatId!

        const found = await this._repo.findOne({
            owner,
            type,
            chatId
        })
        if (found) {
            return found
        }

        const business = await this.create(
            Business.buckwheat(options)
        )

        const {
            id: businessId
        } = business

        await BusinessStockService.create(
            new BusinessStock({
                chatId,
                id: owner,
                businessId,
                count: MAX_BUSINESS_STAKES,
            })
        )

        await BusinessStockMarketSlotService.create(
            new BusinessStockMarketSlot({
                chatId,
                seller: owner,
                businessId,
                count: MAX_BUSINESS_STAKES,
                price: BUCKWHEAT_STAKE_PRICE
            })
        )

        return business
    }

    async getBuckwheat({ chatId, id: botId, type }: GetBuckwheatOptions) {
        return await this._repo.findOne({
            owner: botId,
            type,
            chatId
        })
    }

    async get(businessId: number) {
        return await this._repo.findOne({
            id: businessId
        })
    }

    async getAllByIds(ids: number[]): Promise<Map<number, Business>> {
        const result = new Map<number, Business>()
        const businesses = await this._repo.find({
            id: {
                $in: ids
            }
        })

        for (const business of businesses) {
            result.set(
                business.id,
                business
            )
        }
        return result
    }
}

export default new BusinessService()