import RandomUtils from '../../utils/RandomUtils'
import { DICE_ANSWER_CHANCE } from '../../utils/values/consts'
import { DiceContext } from '../../utils/values/types'
import BaseDice from './BaseDice'

export default class DiceDice extends BaseDice {
    constructor() {
        super()
        this._name = '🎲'
    }

    async execute(ctx: DiceContext, _: number): Promise<void> {
        if(!RandomUtils.chance(DICE_ANSWER_CHANCE)) return
        
        ctx.replyWithDice({
            emoji: this._name
        })
    }
}