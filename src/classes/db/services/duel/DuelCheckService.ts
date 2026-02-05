import { Context } from 'telegraf'
import { HP_MIN_VALUE } from '../../../../utils/values/consts'
import CasinoGetService from '../casino/CasinoGetService'
import DuelistService from '../duelist/DuelistService'
import DuelPrepareService from './DuelPrepareService'
import { Ids } from '../../../../utils/values/types/types'
import MessageUtils from '../../../../utils/MessageUtils'
import ContextUtils from '../../../../utils/ContextUtils'

type CheckAndSendMessageOptions = Ids & {
    ctx: Context
}

export default class {
    static async onDuel(chatId: number, id: number) {
        return await DuelistService.getField(chatId, id, 'onDuel') ?? false
    }

    static async noMoney(chatId: number, id: number) {
        const price = await DuelPrepareService.getPrice(chatId, id)
        const balance = await CasinoGetService.money(chatId, id)

        return balance < price
    }

    static async noHp(chatId: number, id: number) {
        const hp = await DuelistService.getField(chatId, id, 'hp')
        return hp <= HP_MIN_VALUE
    }

    static async check(chatId: number, id: number) {
        const callbacks = [
            { callback: this.onDuel, reason: 'on-duel' },
            { callback: this.noMoney, reason: 'no-money' },
            { callback: this.noHp, reason: 'no-hp' },
        ]

        for (const {
            callback,
            reason
        } of callbacks) {
            if (await callback(chatId, id)) {
                return {
                    done: false,
                    reason
                }
            }
        }

        return {
            done: true,
            reason: 'cool'
        }
    }

    static async checkAndSendMessage({
        ctx,
        chatId,
        id
    }: CheckAndSendMessageOptions) {
        const {
            done,
            reason
        } = await this.check(chatId, id)

        if (!done) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/duel/check/${reason}.pug`,
                {
                    changeValues: {
                        low: await ContextUtils.getUser(chatId, id),
                        price: await DuelPrepareService.getPrice(chatId, id),
                        balance: await CasinoGetService.money(chatId, id)
                    }
                }
            )
        }

        return done
    }
}