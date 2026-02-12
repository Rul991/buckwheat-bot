import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import UserProfileService from '../../../db/services/user/UserProfileService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'whom'
    constructor() {
        super()
        this._name = 'кого'
        this._description = 'выбираю одного из игроков в чате'
        this._replySupport = true
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            chatId,
            other,
            ctx,
        } = options

        const users = await UserProfileService.getAll(chatId)
        const user = RandomUtils.choose(users) ?? {
            id: 0,
            name: 'никого',
        }

        const {
            id,
            name
        } = user

        const link = await ContextUtils.getUser(
            chatId,
            id,
            name
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/whom/done.pug',
            {
                changeValues: {
                    user: link,
                    other
                }
            }
        )
    }
}