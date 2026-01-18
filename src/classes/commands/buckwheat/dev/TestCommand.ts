import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { BROADCAST_TIME, DEV_ID, MILLISECONDS_IN_SECOND, MODE } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatService from '../../../db/services/chat/ChatService'
import { sleep } from '../../../../utils/values/functions'

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
        const chats = await ChatService.getAll()
        for (const chat of chats) {
            const {
                id: dbChatId
            } = chat

            try {
                await ctx.telegram.getChat(dbChatId)
            }
            catch {
                await ChatService.delete(dbChatId)
            }
            await sleep(BROADCAST_TIME)
        }
    }

    async execute({ ctx, other, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if (MODE == 'dev' || (id == DEV_ID && other == '!')) {
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