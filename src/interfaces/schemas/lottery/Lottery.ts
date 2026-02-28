import LotteryTicket from './LotteryTicket'

export default interface Lottery {
    id: number
    tickets: LotteryTicket[]
    price: number
    owner: number
    chatId: number
    isPublic: boolean
}