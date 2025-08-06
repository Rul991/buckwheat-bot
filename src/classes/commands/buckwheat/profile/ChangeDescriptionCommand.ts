import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import { MAX_DESCRIPTION_LENGTH } from '../../../../utils/consts'
import UserDescriptionService from '../../../db/services/user/UserDescriptionService'

export default class ChangeDescriptionCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'описание'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        if(other) {
            let description = other ?? ''

            if(description.length > MAX_DESCRIPTION_LENGTH) {
                await ContextUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/change-description/big.html', 
                    {max: MAX_DESCRIPTION_LENGTH.toString()}
                )
                return
            }

            if(await UserDescriptionService.update(ctx.from?.id ?? 0, description)) {
                await ContextUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/change-description/changed.html'
                )
            }
        }
    }
}