import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class PingCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'прием'
        this._aliases = [
            'приём'
        ]
        this._description = 'прием-прием'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.react(ctx, '🫡')
    }
}