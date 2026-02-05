import SkillAttack from '../../../enums/SkillAttack'
import Skill from '../../../interfaces/duel/Skill'
import Duel from '../../../interfaces/schemas/duels/Duel'
import { CallbackButtonContext } from './contexts'

export type ExecuteType = 'preCheck' | 'execute'
export type ExecuteTarget = keyof Skill['execute']

export type ExecuteSkillOptions = {
    userId: number
    enemyId: number
    chatId: number
    attack: SkillAttack
    duel?: Duel
    ctx: CallbackButtonContext
    skill: string | Skill
}

export type ExecuteSkillMethodOptions = Omit<ExecuteSkillOptions, 'skill'> & {
    skill: Skill
    executeType: ExecuteType
    stopOnFailCheck?: boolean
}

export type GetTextSkillOptions = Omit<MethodOptions<any[]>, 'args' | 'id' | 'boost'> & {
    bold?: boolean
    isSecret?: boolean
}

export type MethodArgsExtends = any[]

export type MethodOptions<A extends MethodArgsExtends> = Omit<ExecuteSkillOptions, 'skill'> & {
    args: A
    skill: Skill
    boost: number
    id: number
}

export type MethodExecuteOptions<A extends MethodArgsExtends> = MethodOptions<A>
export type MethodGetTextOptions<A extends MethodArgsExtends> = MethodOptions<A>