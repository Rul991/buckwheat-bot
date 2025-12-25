import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { MODE } from '../../../../utils/values/consts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MessageUtils from '../../../../utils/MessageUtils'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

type SecretFunctionOptions = {
    ctx: TextContext
    other: MaybeString
    chatId: number
    id: number
}

export default class TestCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'дев'
        this._isShow = false
    }

    private async _secretFunction({
        ctx,
        chatId,
        id,
        other
    }: SecretFunctionOptions) {
        await CasinoAddService.money(chatId, id, 1_000_000)
    }

    async execute({ ctx, other, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if (MODE == 'dev') {
            await this._secretFunction({ ctx, other, chatId, id })
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/dev/${MODE}.pug`,
            {
                changeValues: {
                    name: ctx.message.text
                }
            }
        )
    }
}