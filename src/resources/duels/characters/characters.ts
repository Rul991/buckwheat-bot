import Character from "../../../utils/duel/character/Character"
import type { ClassTypes } from "../../../types/class"
import { attackBardSkill, attackEngineerSkill, attackKnightSkill, attackSorcererSkill, attackThiefSkill, attackBossSkill, attackUniversalSkill, devSkill } from "../skills/skills"

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
        main: attackBardSkill,
        showable: [
            devSkill,
        ]
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
        main: attackUniversalSkill,
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
        main: attackEngineerSkill,
        showable: [
            devSkill,
        ]
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
        main: attackKnightSkill,
        showable: [
            devSkill,
        ]
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
        main: attackSorcererSkill,
        showable: [
            devSkill,
        ]
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
        main: attackThiefSkill,
        showable: [
            devSkill,
        ]
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
        main: attackUniversalSkill,
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
        main: attackBossSkill,
        showable: new Set([
            ...knightCharacter.skills.showable,
            ...thiefCharacter.skills.showable,
            ...sorcererCharacter.skills.showable,
            ...engineerCharacter.skills.showable,
            ...bardCharacter.skills.showable,
        ]).values().toArray()
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