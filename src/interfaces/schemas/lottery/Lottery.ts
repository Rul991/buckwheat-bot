import LotteryTicket from './LotteryTicket'

export default interface Lottery {
    id: number
    tickets: LotteryTicket[]
    price: number
    owner: number
}