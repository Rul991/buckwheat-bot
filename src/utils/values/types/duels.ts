import Duel from '../../../interfaces/schemas/duels/Duel'
import DuelStep from '../../../interfaces/schemas/duels/DuelStep'
import { Link } from './types'

export type DuelistsWithChatId = Pick<Duel, 'firstDuelist' | 'secondDuelist' | 'chatId'>
export type Duelists = Omit<DuelistsWithChatId, 'chatId'>

export type LinkWithPrice = Link & {
    price: number
}

export type FromDuelistsExtra = Partial<
    Omit<DuelStep, 'characteristics'>
>