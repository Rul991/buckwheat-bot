import { MAX_STARS, MIN_STARS } from "../../../../../consts/number"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import MathUtils from "../../../../../utils/math/MathUtils"
import PaymentUtils from "../../../../../utils/payment/PaymentUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import DonatePaymentAction from "../../../payment/DonatePaymentAction"

export default class DonateCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override filename: string = 'donate'
    override minimumRank: number = RankUtils.min
    override settingId: number = 113
    override name: string = 'донат'

    protected override _rankCanBeChange: boolean = false
    override needData: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx,
            other = ''
        } = options

        const rawPrice = StringUtils.getNumberFromString(
            other,
        )
        const price = MathUtils.floor(
            MathUtils.clamp(rawPrice, MIN_STARS, MAX_STARS)
        )
        const money = PaymentUtils.getMoneyByStars(price)

        await DonatePaymentAction.invoice(
            ctx,
            {
                price,
                data: {
                    chatId: BigInt(chatId)
                },
                vars: {
                    money
                }
            }
        )
    }
}