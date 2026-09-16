import Character from "../../../duels/classes/Character"
import Skill from "../../../duels/classes/Skill"
import type { ClassTypes } from "../../../types/class"

export const bardCharacter = new Character({
    hp: {
        start: 80,
        up: 9
    },
    mana: {
        start: 90,
        up: 11
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const bossCharacter = new Character({
    hp: {
        start: 2277,
        up: 1
    },
    mana: {
        start: 1961,
        up: 1
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const botCharacter = new Character({
    hp: {
        start: 999_999_999,
        up: 0
    },
    mana: {
        start: 999_999_999,
        up: 0
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const engineerCharacter = new Character({
    hp: {
        start: 60,
        up: 8
    },
    mana: {
        start: 100,
        up: 11
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const knightCharacter = new Character({
    hp: {
        start: 110,
        up: 11
    },
    mana: {
        start: 60,
        up: 6
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const sorcererCharacter = new Character({
    hp: {
        start: 80,
        up: 8
    },
    mana: {
        start: 100,
        up: 20
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const thiefCharacter = new Character({
    hp: {
        start: 90,
        up: 9
    },
    mana: {
        start: 80,
        up: 11
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const unknownCharacter = new Character({
    hp: {
        start: 0,
        up: 0
    },
    mana: {
        start: 0,
        up: 0
    },
    skills: {
        main: new Skill({} as any),
        showable: []
    }
})

export const characters: Record<ClassTypes, Character> = {
    knight: knightCharacter,
    thief: thiefCharacter,
    sorcerer: sorcererCharacter,
    engineer: engineerCharacter,
    bard: bardCharacter,
    unknown: unknownCharacter,
    boss: bossCharacter,
    bot: botCharacter
}