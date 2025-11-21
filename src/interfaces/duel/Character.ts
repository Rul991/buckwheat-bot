import StartUp from '../other/StartUp'
import Characteristics from './Characteristics'
import Skill from './Skill'

export default interface Character {
    characteristics: StartUp<Characteristics>
    skills: Skill[]
}