import { WORK_TIME } from '../../../../utils/consts'
import { ClassTypes, MaybeString, TextContext } from '../../../../utils/types'
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
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import UserClassService from '../../../db/services/user/UserClassService'

export default class WorkCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'работа'
        this._description = 'даю тебе деньги за твою работу\nчем выше ранг, тем больше денег ты получаешь'
    }

    private static async _getWorkTypes(): Promise<Record<ClassTypes, string[]>> {
        return await FileUtils.readJsonFromResource<Record<ClassTypes, string[]>>('json/other/work_types.json') ?? {
            knight: [],
            thief: [],
            sorcerer: [],
            engineer: [],
            bard: [],
            unknown: []
        }
    }
    
    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const rank = await UserRankService.get(id)
        
        const hasCatalog = await InventoryItemService.use(id, 'workCatalog')
        const workTime = WORK_TIME / (1 + +hasCatalog)

        const money = RandomUtils.range(MIN_WORK, MAX_WORK) * (rank + 1)
        const elapsed = await WorkTimeService.getElapsedTime(id, workTime)

        const workTypes = await WorkCommand._getWorkTypes()
        const isUnknown = RandomUtils.chance(0.5)

        const userClass = await UserClassService.get(id)
        const quests = workTypes[isUnknown ? 'unknown' : userClass]
        const quest = RandomUtils.choose(quests) ?? 'Неизвестный квест'

        if(!elapsed) {
            const hasPassive = await InventoryItemService.use(id, 'workUp')
            const totalMoney = Math.ceil((+hasPassive * 0.15 + 1) * money)

            await CasinoAddService.addMoney(id, totalMoney)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/work/work.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(id),
                        money: totalMoney,
                        quest
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
                        time: TimeUtils.toHHMMSS(workTime - elapsed)
                    }
                }
            )
        }
    }
}