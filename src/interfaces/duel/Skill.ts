import SkillExecute from '../other/SkillExecute'

export default interface Skill {
    id: string
    isAlwaysUsable?: boolean
    secret?: boolean
    level: number
    title: string
    description: string
    onEnemy: boolean
    cost: SkillExecute[]
    execute: SkillExecute[]
    isEffect?: boolean
}