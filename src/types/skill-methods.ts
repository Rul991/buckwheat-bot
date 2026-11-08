import type Duel from "../db/entities/duel/Duel"
import type Duelist from "../db/entities/duel/Duelist"
import type Balance from "../db/entities/money/Balance"
import type User from "../db/entities/user/User"
import type { SkillAttack } from "../protos/duels_pb"
import type LazyValue from "../utils/cache/LazyValue"
import type { BotContext } from "./bot"

export type MethodParticipant = {
    id: number
    user: LazyValue<User | undefined>
    duelist: LazyValue<Duelist | undefined>
    balance: LazyValue<Balance | undefined>
    level: LazyValue<number>
}

export type MethodGetDataOptions = {
    ctx: BotContext
    chatId: number
    target: MethodParticipant
    caster: MethodParticipant
    duel: Duel
    attack: SkillAttack
    boost: number
}

export type MethodPreCheckOptions =
    & Omit<MethodGetDataOptions, 'boost' | 'attack'>
    & {
        data: number
    }

export type MethodExecuteOptions = MethodPreCheckOptions

export type SkillMethodGetTextShowType = 'attack' | 'duel' | 'info'

export type MethodGetSuccessTextOptions =
    & Pick<MethodPreCheckOptions, 'ctx' | 'data'>
    & {
        showType: SkillMethodGetTextShowType
        boost?: number
    }