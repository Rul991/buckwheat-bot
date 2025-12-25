import MafiaPlayer from './MafiaPlayer'
import MafiaStep from './MafiaStep'

export default interface Mafia {
    chatId: number
    players: MafiaPlayer[]
    step: MafiaStep
}