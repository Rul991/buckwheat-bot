import SkillAttack from '../../../enums/SkillAttack'
import Characteristics from '../../duel/Characteristics'
import Effect from './Effect'

export default interface DuelStep {
    duelist: number
    characteristics: Map<string, Characteristics>
    skill?: string
    attack?: SkillAttack
    effects?: Effect[]
}