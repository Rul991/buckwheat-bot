import SkillAttack from '../../enums/SkillAttack'
import { MIN_DICE_VALUE, MAX_DICE_VALUE } from '../values/consts'

export default class {
    static getByDice(dice: number): SkillAttack {
        if (dice == MIN_DICE_VALUE) {
            return SkillAttack.Fail
        }
        else if (dice == MAX_DICE_VALUE) {
            return SkillAttack.Crit
        }

        return SkillAttack.Normal
    }

    static fromNumber(value: number): SkillAttack {
        if(value <= 0) {
            return SkillAttack.Fail
        }
        else if(value == 1) {
            return SkillAttack.Normal
        }
        else {
            return SkillAttack.Crit
        }
    }
}