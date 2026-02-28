import AdminUtils from '../../../../utils/AdminUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'custom-title'

    constructor () {
        super()
        this._name = 'приписка'
        this._aliases = [
            'подпись'
        ]

        this._description = 'выдаю приписку администратора\nбез аргументов убираю приписку'
        this._minimumRank = 5

        this._replySupport = true
        this._needData = true
        this._argumentText = 'приписка'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            chatId,
            other = '',
            replyFrom
        } = options

        if (!replyFrom) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/custom-title/no-reply.pug'
            )
            return
        }

        const id = replyFrom.id
        const hasTitle = other.length > 0
        const filename = hasTitle ? 'got' : 'lose'

        const isUpdatedTitle = await AdminUtils.setAdminTitle(
            ctx,
            id,
            other
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/custom-title/${filename}.pug`,
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, id),
                    title: other,
                    isUpdatedTitle
                }
            }
        )
    }
}