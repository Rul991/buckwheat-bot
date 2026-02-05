import SkillExecute from '../other/SkillExecute'

export default interface Skill {
    id: string
    alwaysUsable?: boolean
    level: number
    info: {
        title: string
        description: string
    }
    execute: {
        user: SkillExecute[]
        enemy: SkillExecute[]
    }
}