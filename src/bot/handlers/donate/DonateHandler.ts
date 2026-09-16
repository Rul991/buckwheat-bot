import type { MyBot } from "../../../types/bot"
import type DonateAction from "../../actions/base/DonateAction"
import BaseHandler from "../base/BaseHandler"

export default class DonateHandler extends BaseHandler<DonateAction<any>> {
    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            'pre_checkout_query',
            async ctx => {
                ctx.answerPreCheckoutQuery(
                    true,
                    {
                        
                    }
                )

                ctx.answerShippingQuery(
                    true,
                    {
                        'shipping_options': [
                            {
                                'prices': [
                                    {
                                        
                                    }
                                ]
                            }
                        ]
                    }
                )
            }
        )

        bot.on(
            'shipping_query',
            async ctx => {

            }
        )
    }
}