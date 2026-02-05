import Skill from './Skill'

export default interface JsonSkill extends Omit<Skill, 'id' | 'alwaysUsable'> {
    
}