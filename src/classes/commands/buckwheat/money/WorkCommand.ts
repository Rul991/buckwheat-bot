import { CATALOG_BOOST, LEVEL_BOOST, LEVEL_UP_MONEY, WORK_TIME } from '../../../../utils/values/consts'
import { ClassTypes, MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import { MAX_WORK, MIN_WORK } from '../../../../utils/values/consts'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import MessageUtils from '../../../../utils/MessageUtils'
import WorkTimeService from '../../../db/services/work/WorkTimeService'
import ContextUtils from '../../../../utils/ContextUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import FileUtils from '../../../../utils/FileUtils'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import UserClassService from '../../../db/services/user/UserClassService'
import ClassUtils from '../../../../utils/ClassUtils'
import ExperienceService from '../../../db/services/level/ExperienceService'
import LevelUtils from '../../../../utils/level/LevelUtils'
import LevelService from '../../../db/services/level/LevelService'
import RankUtils from '../../../../utils/RankUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import PremiumChatService from '../../../db/services/chat/PremiumChatService'

type TotalMoney = {
    money: number
    isPremium: boolean
    hasUp: boolean
}

export default class WorkCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'работа'
        this._description = 'даю тебе деньги за твою работу\nчем выше ранг, тем больше денег ты получаешь'
        this._aliases = [
            'фарма',
            'ферма',
            'ворк'
        ]
    }

    private _fromBooleanToBoost(bool: boolean, procents = 0.25) {
        return (+bool * procents) + 1
    } 

    private _getTotalMoney({money, isPremium, hasUp}: TotalMoney) {
        return Math.ceil(
            this._fromBooleanToBoost(hasUp) * 
            money * 
            this._fromBooleanToBoost(isPremium)
        )
    }

    private static async _getWorkTypes(): Promise<Record<ClassTypes, string[]>> {
        return await FileUtils.readJsonFromResource<Record<ClassTypes, string[]>>('json/other/work_types.json') ?? ClassUtils.getArray()
    }
    
    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return
        const rank = await UserRankService.get(chatId, id)
        
        const [hasCatalog] = await InventoryItemService.use(chatId, id, 'workCatalog')
        const workTime = WORK_TIME / (hasCatalog ? CATALOG_BOOST : 1)

        const money = RandomUtils.range(MIN_WORK, MAX_WORK) * Math.max(rank + 1, RankUtils.moderator)
        const elapsed = await WorkTimeService.getElapsedTime(chatId, id, workTime)

        const workTypes = await WorkCommand._getWorkTypes()
        const isUnknown = RandomUtils.chance(0.5)

        const userClass = await UserClassService.get(chatId, id)
        const quests = workTypes[isUnknown ? ClassUtils.defaultClassName : userClass]
        const quest = RandomUtils.choose(quests) ?? 'Неизвестный квест'

        if(!elapsed) {
            const isPremium = await PremiumChatService.isPremium(chatId)
            const [hasUp] = await InventoryItemService.use(chatId, id, 'workUp')
            const totalMoney = this._getTotalMoney({money, isPremium, hasUp})

            const currentLevel = await LevelService.get(chatId, id)
            const rawExperience = RandomUtils.range(3, Math.min(100, 3 * currentLevel))
            const [_, count] = await InventoryItemService.use(chatId, id, 'levelBoost')

            const experience = Math.ceil(rawExperience * (1 + (count * LEVEL_BOOST / 100)))
            const newLevel = await ExperienceService.isLevelUpAfterAdding(chatId, id, experience)

            await CasinoAddService.money(chatId, id, totalMoney)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/work/work.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUserFromContext(ctx),
                        money: totalMoney,
                        quest,
                        experience
                    }
                }
            )

            if(newLevel) {
                await CasinoAddService.money(chatId, id, newLevel * LEVEL_UP_MONEY)
                await LevelUtils.sendLevelUpMessage(ctx, newLevel)
            }
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