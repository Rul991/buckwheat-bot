import { Context } from 'telegraf'
import BaseDice from './BaseDice'

export default class WrongDice extends BaseDice {
    async execute(ctx: Context, _: number): Promise<void> {
        
    }
}