import StartUp from '../other/StartUp'

export default interface Character {
    characteristics: {
        hp: StartUp<number>
        mana: StartUp<number>
    }
    skill: {
        showable: string[]
        main: string
        effects: string[]
    }
}