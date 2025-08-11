import { WORK_TIME } from './../../../utils/consts'
import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import UserRankService from '../../db/services/user/UserRankService'
import { DEFAULT_USER_NAME, MAX_WORK, MIN_WORK } from '../../../utils/consts'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import MessageUtils from '../../../utils/MessageUtils'
import WorkTimeService from '../../db/services/work/WorkTimeService'
import ContextUtils from '../../../utils/ContextUtils'
import UserNameService from '../../db/services/user/UserNameService'
import TimeUtils from '../../../utils/TimeUtils'
import RandomUtils from '../../../utils/RandomUtils'

export default class WorkCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'работа'
        this._description = 'даю тебе деньги за твою работу\nчем выше ранг, тем больше денег ты получаешь'
    }
    
    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from?.id ?? 0
        const rank = await UserRankService.get(id)

        const money = RandomUtils.range(MIN_WORK, MAX_WORK) * (rank + 1)
        const elapsed = await WorkTimeService.getElapsedTime(id)

        if(!elapsed) {
            await CasinoAddService.addMoney(id, money)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/work/work.pug',
                {
                    changeValues: {
                        link: ContextUtils.getLinkUrl(id),
                        name: await UserNameService.get(id) ?? DEFAULT_USER_NAME,
                        money
                    }
                }
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/work/cant.pug',
                {
                    changeValues: {
                        time: TimeUtils.toHHMMSS(WORK_TIME - elapsed)
                    }
                }
            )
        }
    }
}