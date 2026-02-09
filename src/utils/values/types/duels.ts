import { Context } from 'telegraf'
import Duel from '../../../interfaces/schemas/duels/Duel'
import DuelStep from '../../../interfaces/schemas/duels/DuelStep'
import { Ids, Link } from './types'
import Skill from '../../../interfaces/duel/Skill'

export type DuelistsWithChatId = Pick<Duel, 'firstDuelist' | 'secondDuelist' | 'chatId'>
export type Duelists = Omit<DuelistsWithChatId, 'chatId'>

export type LinkWithPrice = Link & {
    price: number
}

export type FromDuelistsExtra = Partial<
    Omit<DuelStep, 'characteristics'>
>

export type DuelEndOptions = {
    duel: Duel
    winner: number
    ctx: Context
}

export type DuelEndUtilsOptions = DuelEndOptions & {
    chatId: number
}

export type SpecialEffectOptions = Ids & {
    duel: Duel
    skill: Skill
}
export type GenericSpecialEffectOptions<O extends object> = O & SpecialEffectOptions
export type SpecialEffectGetOptions = SpecialEffectOptions