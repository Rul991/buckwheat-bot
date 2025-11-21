import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'

export default class TransferCommand extends BuckwheatCommand {
    private static _filenames = ['no-receiver', 'self', 'empty', 'wrong', 'negative']

    private static _getIdByCondition(ctx: TextContext, other: MaybeString): number {
        const conditions = [
            !('reply_to_message' in ctx.message!),
            ctx.from?.id == ctx.message?.reply_to_message?.from?.id,
            !other,
            isNaN(StringUtils.getNumberFromString(other ?? '')),
        ]

        for (let i = 0; i < conditions.length; i++) {
            if(conditions[i]) return i
        }

        return NOT_FOUND_INDEX
    }

    private static async _sendMessage(ctx: TextContext, filename: string) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/transfer/${filename}.pug`
        )
    }

    constructor() {
        super()
        this._name = 'переведи'
        this._description = 'перевожу монеты с твоего кошелька на кошелек игрока, на сообщение которого ты ответил'
        this._needData = true
        this._replySupport = true
        this._argumentText = 'деньги'
        this._aliases = [
            'перевести',
            'передать'
        ]
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return
        const filenameId = TransferCommand._getIdByCondition(ctx, other)

        if(filenameId !== NOT_FOUND_INDEX) {
            await TransferCommand._sendMessage(
                ctx,
                TransferCommand._filenames[filenameId]
            )
        }
        
        else {
            const sender = ctx.from.id
            //@ts-ignore
            const receiver: number | undefined = ctx.message.reply_to_message?.from?.id

            if(receiver === undefined) return

            const senderMoney = await CasinoGetService.money(chatId, ctx.from.id)
            const rawDiffMoney = StringUtils.getNumberFromString(other!)
            const diffMoney = Math.abs(Math.ceil(rawDiffMoney))

            if(senderMoney < diffMoney) {
                await TransferCommand._sendMessage(
                    ctx,
                    'not-enough'
                )
                return
            }

            await CasinoAddService.money(chatId, sender, -diffMoney)
            await CasinoAddService.money(chatId, receiver, diffMoney)

            MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/transfer/positive.pug',
                {
                    changeValues: {
                        sender: await ContextUtils.getUser(chatId, sender),
                        receiver: await ContextUtils.getUser(chatId, receiver),
                        count: StringUtils.toFormattedNumber(diffMoney),
                        raw: rawDiffMoney
                    }
                }
            )
        }
    }
}