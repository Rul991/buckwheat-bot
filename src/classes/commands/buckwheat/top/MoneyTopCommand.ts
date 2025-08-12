import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/types'
import CasinoRepository from '../../../db/repositories/CasinoRepository'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import UserProfileService from '../../../db/services/user/UserProfileService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class MoneyTopCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'богачи'
        this._description = 'показываю список от богатых к бедным'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const sortedCasinos = await CasinoGetService.getSortedCasinos()
        const users = await UserProfileService.getAll()

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/top-money.pug',
            {
                changeValues: {
                    casinos: sortedCasinos,
                    users
                }
            }
        )
    }
}