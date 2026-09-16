import { setTimeout } from "node:timers/promises"
import { MAX_DEBT_VALUE } from "../../../consts/number"
import type { DiceActionOptions } from "../../../types/action-options"
import type { Dices } from "../../../types/types"
import MessageUtils from "../../../utils/bot/MessageUtils"
import DiceAction from "../base/DiceAction"
import BalanceService from "../../../db/services/money/BalanceService"
import GameService from "../../../db/services/game/GameService"

type JackpotValues = {
    values: number[]
    prize: number
    type: string
}

export default class CasinoDiceAction extends DiceAction {
    override settingId: number = 31
    private _jackpotValues: JackpotValues[] = [
        {
            values: [1, 22, 43],
            prize: 5,
            type: 'win'
        },
        {
            values: [64],
            prize: 10,
            type: 'jackpot'
        }
    ]
    private _loseValue: JackpotValues = {
        values: [],
        prize: -1,
        type: 'lose'
    }
    private _delay = 1750
    
    override filename: string = 'casinodice'
    override name: Dices = '🎰'
    
    private _getJackpotValue(value: number): JackpotValues {
        const jackpotValue = this._jackpotValues
        .find(v => v.values.includes(value)) ?? this._loseValue
        
        return jackpotValue
    }

    override async execute(options: DiceActionOptions): Promise<void> {
        const {
            ctx,
            chatId,
            id,
            value
        } = options

        const gameType = 'casino'
        const balance = ctx.vars.balance?.total ?? 0
        const jackpotValue = this._getJackpotValue(value)
        const {
            prize,
            type
        } = jackpotValue

        if(type == 'lose') {
            await GameService.lose({
                chatId,
                id,
                type: gameType
            })
        }
        else {
            await GameService.win({
                chatId,
                id,
                type: gameType
            })
        }

        if (balance + prize >= MAX_DEBT_VALUE) {
            await setTimeout(this._delay)
            await BalanceService.add({
                chatId,
                id,
                money: prize
            })
            await MessageUtils.reply(
                ctx,
                'casino/result',
                {
                    vars: {
                        prize,
                        user: ctx.vars.user,
                        type
                    }
                }
            )
        }
        else {
            await MessageUtils.deleteMessages(ctx)
        }
    }
}