import BalanceService from "../../../../../db/services/money/BalanceService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import MathUtils from "../../../../../utils/math/MathUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SendMoneyCommand extends BuckwheatCommand {
    override aliases: string[] = ['перевести', 'передать', 'перевод']
    override minimumRank: number = RankUtils.min
    override settingId: number = 27
    override name: string = 'переведи'
    override filename: string = 'transfer'
    override isSupportReply: boolean = true
    override needData: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            replyFrom,
            other
        } = options


        if (!other || !other.length) {
            return {
                key: 'transfer/no-other'
            }
        }

        const rawTranferMoney = StringUtils.getNumberFromString(other, 0)
        const transferMoney = MathUtils.floor(Math.abs(rawTranferMoney))

        if (!replyFrom) {
            return {
                key: 'transfer/no-reply',
                options: {
                    vars: {
                        money: transferMoney
                    }
                }
            }
        }

        const user = ctx.vars.user

        const balance = ctx.vars.balance
        const userMoney = balance?.total ?? 0

        if (transferMoney > userMoney) {
            return {
                key: 'transfer/no-money',
                options: {
                    vars: {
                        money: userMoney,
                        user,
                    }
                }
            }
        }
        
        const reply = await UserService.get(chatId, replyFrom.id)

        if (replyFrom.id != id) {
            await BalanceService.add({
                chatId,
                id,
                money: -transferMoney
            })

            await BalanceService.add({
                chatId,
                id: replyFrom.id,
                money: transferMoney
            })
        }

        return {
            key: 'transfer/transfer',
            options: {
                vars: {
                    money: transferMoney,
                    raw: rawTranferMoney,
                    user,
                    reply,
                    isTransfer: true
                }
            }
        }
    }
}