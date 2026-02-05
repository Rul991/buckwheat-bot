import Duel from '../../../interfaces/schemas/duels/Duel'
import { Link } from './types'

export type DuelistsWithChatId = Pick<Duel, 'firstDuelist' | 'secondDuelist' | 'chatId'>
export type Duelists = Omit<DuelistsWithChatId, 'chatId'>

export type LinkWithPrice = Link & {
    price: number
}