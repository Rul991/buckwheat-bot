import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import { MAX_DESCRIPTION_LENGTH } from '../../../../utils/values/consts'
import UserDescriptionService from '../../../db/services/user/UserDescriptionService'
import MessageUtils from '../../../../utils/MessageUtils'

export default class ChangeDescriptionCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'описание'
        this._description = 'меняю вам описание профиля в беседе'
        this._needData = true
        this._argumentText = 'описание'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(other) {
            let description = other ?? ''

            if(description.length > MAX_DESCRIPTION_LENGTH) {
                await MessageUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/change-description/big.pug', 
                    {changeValues: {max: MAX_DESCRIPTION_LENGTH.toString()}}
                )
                return
            }

            await UserDescriptionService.update(ctx.from?.id ?? 0, description)
            await MessageUtils.answerMessageFromResource(
                ctx, 
                'text/commands/change-description/changed.pug'
            )
        }
    }
}