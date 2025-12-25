import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../../db/services/marriage/MarriageService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class DivorceCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'развестись'
        this._aliases = [
            'развод',
            'расстаться'
        ]
        this._description = 'выполняю услуги ЗАГСа'
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const marriage = await MarriageService.get(chatId, id)
        const {
            partnerId
        } = marriage

        const isDivorced = Boolean(
            partnerId && await MarriageService.divorce(chatId, id, partnerId)
        )

        const changeValues = {
            user: await ContextUtils.getUser(chatId, id),
            reply: await ContextUtils.getUser(chatId, partnerId),
        }

        if (isDivorced) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/divorce/divorce.pug',
                { changeValues }
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/divorce/not-equal.pug',
                { changeValues }
            )
        }
    }
}