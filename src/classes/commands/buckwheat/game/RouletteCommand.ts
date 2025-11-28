import AdminUtils from '../../../../utils/AdminUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import StringUtils from '../../../../utils/StringUtils'
import { ROULETTE_CHANCE } from '../../../../utils/values/consts'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import RouletteService from '../../../db/services/roulette/RouletteService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class RouletteCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'рулетка'
        this._description = 'даю пощекотать нервы'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/roulette/private.pug'
            )
            return
        }

        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const isKilled = RandomUtils.chance(ROULETTE_CHANCE)
        const {winStreak, prize} = isKilled ? 
            await RouletteService.lose(chatId, id) : 
            await RouletteService.win(chatId, id)

        const changeValues = {
            ...await ContextUtils.getUserFromContext(ctx),
            winStreak: StringUtils.toFormattedNumber(winStreak),
            prize: StringUtils.toFormattedNumber(prize),
            needPrize: prize > 0
        }

        if(isKilled) {
            const isKicked = await AdminUtils.kick(ctx, ctx.from.id)

            if(isKicked) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/roulette/killed.pug',
                    {changeValues}
                )
            }
            else {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/roulette/saved.pug',
                    {changeValues}
                )
            }
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/roulette/lucky.pug',
                {changeValues}
            )
        }
    }
}