import type { Characteristics } from "../../types/duels"
import type { StartUp } from "../../types/types"
import CharacteristicsUtils from "../../utils/duel/CharacteristicsUtils"
import type Skill from "./Skill"

export default class Character {
    private _totalSkills: Skill[]
    skills: {
        showable: Skill[]
        main: Skill
    }

    hp: StartUp<number>
    mana: StartUp<number>

    constructor({
        hp,
        mana,
        skills
    }: Pick<Character, 'hp' | 'mana' | 'skills'>) {
        this.hp = hp
        this.mana = mana

        this.skills = skills
        this._totalSkills = [
            ...this.skills.showable,
            this.skills.main
        ]
    }

    private _calcStartUp(level: number, startup: StartUp<number>): number {
        return CharacteristicsUtils.calcStartUp(level, startup)
    }

    getMana(level: number): number {
        return this._calcStartUp(
            level,
            this.mana
        )
    }

    getHealth(level: number): number {
        return this._calcStartUp(
            level,
            this.hp
        )
    }

    getMaxCharacteristics(level: number): Characteristics {
        return {
            hp: this.getHealth(level),
            mana: this.getMana(level),
        }
    }

    canUse(skill: Skill): boolean {
        if (skill.alwaysUsable) return true
        return this._totalSkills.some(v => v.id == skill.id)
    }
}