import { MONEY_DROP_TIME } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class MoneyDropCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'монетка'
        this._description = 'кидаю монетку'
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        if(await CasinoGetService.money(chatId, id) <= 0) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/money-drop/no-money.pug'
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/money-drop/money.pug'
        )

        setTimeout(async () => {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/money-drop/result.pug'
            )
        }, MONEY_DROP_TIME)
    }
}