import { MafiaTypes } from '../../../utils/values/types/types'
import MafiaVote from './MafiaVote'

export default interface MafiaPlayer {
    id: number
    alive: boolean
    type: MafiaTypes
    vote: MafiaVote
}