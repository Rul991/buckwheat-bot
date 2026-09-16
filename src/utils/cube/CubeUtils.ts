import { MAX_CUBE_BET, MAX_DEBT_VALUE } from "../../consts/number"
import Logger from "../logs/Logger"

export default class CubeUtils {
    static getBet(rawBet: number, userMoney: number): number {
        const result = rawBet == 0 ?
            0 :Math.min(
            Math.abs(rawBet),
            userMoney - MAX_DEBT_VALUE
        )

        Logger.debug(
            'CubeUtils.getBet',
            {
                result,
                rawBet,
                userMoney
            }
        )
        return Math.min(result, MAX_CUBE_BET)
    }

    static checkBalance(rawBet: number, userMoney: number): boolean {
        const bet = this.getBet(rawBet, userMoney)
        const result = rawBet == 0 || bet <= userMoney - MAX_DEBT_VALUE

        Logger.debug(
            'CubeUtils.checkBalance',
            {
                rawBet,
                bet,
                userMoney,
                result
            }
        )
        return result
    }
}