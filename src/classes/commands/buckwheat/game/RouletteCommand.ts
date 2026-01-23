import AdminUtils from '../../../../utils/AdminUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import StringUtils from '../../../../utils/StringUtils'
import { KICK_TIME, ROULETTE_CHANCE } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import RouletteService from '../../../db/services/roulette/RouletteService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class RouletteCommand extends BuckwheatCommand {
    protected _settingId: string = 'roulette'

    constructor() {
        super()
        this._name = 'рулетка'
        this._description = 'даю пощекотать нервы'
    }

    async execute({ ctx, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/roulette/private.pug'
            )
            return
        }

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
            const isKicked = await AdminUtils.ban(ctx, ctx.from.id, KICK_TIME)

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