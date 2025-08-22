import BaseDice from './BaseDice'
import { DiceContext } from '../../utils/values/types'

export default class WrongDice extends BaseDice {
    async execute(ctx: DiceContext, _: number): Promise<void> {
        
    }
}