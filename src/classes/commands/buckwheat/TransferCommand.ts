import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import ContextUtils from '../../../utils/ContextUtils'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import UserNameService from '../../db/services/user/UserNameService'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoAccountService from '../../db/services/casino/CasinoAccountService'

export default class TransferCommand extends BuckwheatCommand {
    private static _filenames = ['no-receiver', 'self', 'empty', 'wrong', 'negative']

    private static async _getName(id: number): Promise<MaybeString> {
        return (await UserNameService.get(id)) ?? undefined
    }

    private static _getIdByCondition(ctx: Context, other: MaybeString): number {
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

    private static async _sendMessage(ctx: Context, filename: string) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/transfer/${filename}.html`
        )
    }

    constructor() {
        super()
        this._name = 'переведи'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
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

            const senderName = await TransferCommand._getName(sender)
            const receiverName = await TransferCommand._getName(receiver)

            MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/transfer/positive.pug',
                {
                    changeValues: {
                        sender: {
                            link: ContextUtils.getLinkUrl(sender),
                            name: senderName
                        },
                        receiver: {
                            link: ContextUtils.getLinkUrl(receiver),
                            name: receiverName
                        },
                        count: diffMoney
                    },
                    isParseToHtmlEntities: true
                }
            )
        }
    }
}