import { MONEY_DROP_TIME } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class MoneyDropCommand extends BuckwheatCommand {
    protected _settingId: string = 'moneyDrop'

    constructor() {
        super()
        this._name = 'монетка'
        this._description = 'бросаю монетку'
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