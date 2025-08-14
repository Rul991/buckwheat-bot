import { WORK_TIME } from '../../../../utils/consts'
import { MaybeString, TextContext } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import { MAX_WORK, MIN_WORK } from '../../../../utils/consts'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import MessageUtils from '../../../../utils/MessageUtils'
import WorkTimeService from '../../../db/services/work/WorkTimeService'
import ContextUtils from '../../../../utils/ContextUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import FileUtils from '../../../../utils/FileUtils'

export default class WorkCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'работа'
        this._description = 'даю тебе деньги за твою работу\nчем выше ранг, тем больше денег ты получаешь'
    }

    private static async _getWorkTypes(): Promise<string[]> {
        return await FileUtils.readJsonFromResource<string[]>('json/other/work_types.json') ?? []
    }
    
    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
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
                        ...await ContextUtils.getUser(id),
                        money,
                        quest: RandomUtils.choose(await WorkCommand._getWorkTypes())
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