import LotteryTicket from '../../interfaces/schemas/lottery/LotteryTicket'

export default class {
    static getMinMaxPrize(tickets: LotteryTicket[]) {
        if(!tickets.length) {
            return {
                min: 0,
                max: 0
            }
        }
        return tickets.reduce(
            (result, { prize }) => {
                result.min = Math.min(result.min, prize)
                result.max = Math.max(result.max, prize)
                return result
            },
            {
                min: Infinity,
                max: -Infinity
            }
        )
    }
}