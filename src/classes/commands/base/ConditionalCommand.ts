import { Context } from 'telegraf'
import { CommandStrings, MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from './BuckwheatCommand'

export default abstract class ConditionalCommand extends BuckwheatCommand {
    abstract condition(ctx: TextContext, [firstWord, command, other]: CommandStrings): boolean | Promise<boolean>

    async executeIfCondition(ctx: TextContext, message: CommandStrings): Promise<boolean> {
        if(await this.condition(ctx, message)) {
            const [_word, _command, other] = message
            await this.execute(ctx, other)
            return true
        }

        return false
    }
}