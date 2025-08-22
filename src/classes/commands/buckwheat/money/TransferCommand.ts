import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import UserNameService from '../../../db/services/user/UserNameService'
import MessageUtils from '../../../../utils/MessageUtils'

export default class TransferCommand extends BuckwheatCommand {
    private static _filenames = ['no-receiver', 'self', 'empty', 'wrong', 'negative']

    private static async _getName(id: number): Promise<MaybeString> {
        return (await UserNameService.get(id)) ?? undefined
    }

    private static _getIdByCondition(ctx: TextContext, other: MaybeString): number {
        const conditions = [
            !('reply_to_message' in ctx.message!),
            //@ts-ignore
            ctx.from?.id == ctx.message?.reply_to_message?.from?.id,
            !other,
            isNaN(+other!),
            +other! < 0,
        ]

        for (let i = 0; i < conditions.length; i++) {
            if(conditions[i]) return i
        }

        return -1
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
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(!ctx.from) return
        if(!ctx.message) return

        const filenameId = TransferCommand._getIdByCondition(ctx, other)

        if(filenameId !== -1) {
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

            const senderMoney = await CasinoGetService.getMoney(ctx.from.id)
            const diffMoney = Math.ceil(+other!)

            if(senderMoney < diffMoney) {
                await TransferCommand._sendMessage(
                    ctx,
                    'not-enough'
                )
                return
            }

            await CasinoAddService.addMoney(sender, -diffMoney)
            await CasinoAddService.addMoney(receiver, diffMoney)

            MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/transfer/positive.pug',
                {
                    changeValues: {
                        sender: await ContextUtils.getUser(sender),
                        receiver: await ContextUtils.getUser(receiver),
                        count: diffMoney
                    }
                }
            )
        }
    }
}