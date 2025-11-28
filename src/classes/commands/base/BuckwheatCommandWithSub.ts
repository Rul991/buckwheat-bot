import { FullSubCommandObject } from '../../../utils/values/types/types'
import BuckwheatCommand from './BuckwheatCommand'
import { TextContext, MaybeString } from '../../../utils/values/types/types'
import SubCommandUtils from '../../../utils/SubCommandUtils'

export default abstract class BuckwheatCommandWithSub<Sub extends FullSubCommandObject> extends BuckwheatCommand {
    protected _subCommands: Sub[]
    protected _needData: boolean = true

    constructor(subCommands: Sub[]) {
        super()
        this._subCommands = subCommands
        this._argumentText = SubCommandUtils.getArgumentText(this._subCommands)
    }

    protected async _execute(ctx: TextContext, [sub, data]: [Sub, string]): Promise<void> {
        const isRightData = await sub.execute(ctx, data)

        if(isRightData) {
            await this._handleWrongDataCommand(ctx, sub)
        }
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const subCommand = SubCommandUtils.getSubCommandAndData(
            other, 
            this._subCommands
        )
        
        if(subCommand == 'no-text') {
            await this._handleNotExistCommand(ctx)
        }
        else if(subCommand == 'not-exist') {
            await this._handleNotExistCommand(ctx)
        }
        else {
            await this._execute(ctx, subCommand)
        }
    }

    protected abstract _handleNoText(ctx: TextContext): Promise<void>
    protected abstract _handleNotExistCommand(ctx: TextContext): Promise<void>
    protected abstract _handleWrongDataCommand(ctx: TextContext, sub: Sub): Promise<void>
}