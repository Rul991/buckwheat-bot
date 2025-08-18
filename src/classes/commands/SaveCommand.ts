import AdminUtils from '../../utils/AdminUtils'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../utils/types'
import BuckwheatCommand from './base/BuckwheatCommand'

export default class SaveCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'сохраниться'
        this._isShow = false
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(other != 'и выйти') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/wrongCommand.pug'
            )
            return
        }

        const isKicked = await AdminUtils.kick(ctx, ctx.from.id)
        const filename = isKicked ? 'done' : 'cant'

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/save/${filename}.pug`,
            {
                changeValues: await ContextUtils.getUser(
                    ctx.from.id, 
                    ctx.from.first_name
                )
            }
        )
    }
}