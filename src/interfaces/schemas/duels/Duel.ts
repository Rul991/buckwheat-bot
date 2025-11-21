import DuelStep from './DuelStep'
import Effect from './Effect'

export default interface Duel {
    id: number
    chatId: number
    firstDuelist: number
    secondDuelist: number
    step: DuelStep
    bidId?: number
    effects?: Effect[]
    steps?: number
}