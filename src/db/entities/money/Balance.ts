import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import CoOwner from "./CoOwners"
import type { BalanceType } from "../../../types/db"

export default class Balance extends ChatIdEntity {
    static readonly defaultMoney = 50
    static default(chatId: number, id: number, type: BalanceType = 'user'): Balance {
        return new Balance({
            chatId,
            id,
            type,
            owners: [
                {
                    id,
                    stake: this.defaultMoney
                }
            ]
        })
    }

    static user(chatId: number, id: number, money: number = this.defaultMoney): Balance {
        const result = new Balance({
            chatId,
            id,
            type: 'user',
            owners: [
                {
                    id,
                    stake: money
                }
            ]
        })
        
        return result
    }

    static add(balance: Balance, owner: CoOwner): Balance {
        balance.total += owner.stake
        const ownerIndex = balance.owners.findIndex(
            coowner => {
                return coowner.id == owner.id
            }
        )

        if(ownerIndex !== -1) {
            balance.owners[ownerIndex]!.stake += owner.stake
        }
        else {
            balance.owners.push(owner)
        }

        return balance
    }

    @prop({ type: [CoOwner] })
    owners: CoOwner[]

    @prop()
    total: number

    @prop({ type: String })
    type: BalanceType // 'user' | 'business'

    constructor({
        chatId,
        id,
        owners,
        type
    }: Omit<Balance, '_id' | 'total'>) {
        super(chatId, id)
        this.owners = owners
        this.total = owners.reduce(
            (total, owner) => {
                return total + owner.stake
            },
            0
        )
        this.type = type
    }
}