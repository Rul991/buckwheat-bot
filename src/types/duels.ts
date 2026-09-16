import type Duel from "../db/entities/duel/Duel"
import type { SkillAttack } from "../protos/duels_pb"
import type { BotContext } from "./bot"

export type Characteristics = {
    hp: number
    mana: number
}

export type MethodGetDataOptions = {
    ctx: BotContext
    chatId: number
    id: number
    userId: number
    enemyId: number
    duel: Duel
    attack: SkillAttack
    boost: number
}

export type MethodPreCheckOptions = 
    & MethodGetDataOptions
    & {
        data: number
    }

export type MethodExecuteOptions =
    & MethodPreCheckOptions

export type MethodGetTextOptions =
    & Pick<MethodPreCheckOptions, 'data' | 'ctx'>

export type CanSaveDuelistResult = {
    isCan: boolean
    remainingTime: number
}