import DuelStep from './DuelStep'

export default interface Duel {
    id: number
    chatId: number
    firstDuelist: number
    secondDuelist: number
    steps: DuelStep[]
    bidId?: number
}