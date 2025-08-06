import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import { DEFAULT_USER_NAME, MAX_NAME_LENGTH } from '../../../../utils/consts'
import UserNameService from '../../../db/services/user/UserNameService'
import StringUtils from '../../../../utils/StringUtils'

export default class ChangeNameCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'ник'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        const link = ContextUtils.getLinkUrl(ctx.from?.id ?? 0)

        if(!other) {
            const name = await UserNameService.get(ctx.from?.id!) ?? DEFAULT_USER_NAME

            await ContextUtils.answerMessageFromResource(
                ctx, 
                'text/commands/change-name/name.html', 
                {link, name}
            )
        }

        else {
            let name = StringUtils.validate(other ?? '')

            if(name.length > MAX_NAME_LENGTH) {
                await ContextUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/change-name/big-name.html', 
                    {max: MAX_NAME_LENGTH.toString()}
                )
                return
            }

            if(await UserNameService.update(ctx.from?.id ?? 0, name)) {
                await ContextUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/change-name/changed.html', 
                    {link, name},
                    true
                )
            }
        }
    }
}