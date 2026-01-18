import { CATALOG_BOOST, LEVEL_BOOST, LEVEL_UP_MONEY, WORK_TIME } from '../../../../utils/values/consts'
import { ClassTypes, MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
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
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import PremiumChatService from '../../../db/services/chat/PremiumChatService'
import ChatSettingsService from '../../../db/services/settings/ChatSettingsService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import UserSettingsService from '../../../db/services/settings/UserSettingsService'
import GrindSettingService from '../../../db/services/settings/GrindSettingService'

type Boost = {
    value: boolean,
    procents?: number
}

type TotalMoney = {
    money: number
    boosts: Boost[]
}

export default class WorkCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'работа'
        this._description = 'даю тебе деньги за твою работу'
        this._aliases = [
            'фарма',
            'ферма',
            'ворк'
        ]
    }

    private _fromBooleanToBoost(bool: boolean, procents = 0.25) {
        return (+bool * procents) + 1
    }

    private _getMoney({ money, boosts }: TotalMoney) {
        return Math.ceil(
            money *
            boosts.reduce((prev, { value, procents }) => {
                return prev * this._fromBooleanToBoost(value, procents)
            }, 1)
        )
    }

    private async _getBoosts(chatId: number, id: number): Promise<Boost[]> {
        const isPremium = await PremiumChatService.isPremium(chatId)
        const [hasUp] = await InventoryItemService.use(chatId, id, 'workUp')

        return [
            { value: isPremium },
            { value: hasUp },
        ]
    }

    private async _getTotalMoney(chatId: number, id: number) {
        const money = RandomUtils.range(MIN_WORK, MAX_WORK)
        const boosts = await this._getBoosts(chatId, id)

        return this._getMoney({
            money,
            boosts
        })
    }

    private async _getExperience(chatId: number, id: number) {
        const currentLevelUp = 1
        const multiplier = 17
        const max = 625

        const currentLevel = await LevelService.get(chatId, id)
        const rawExperience = RandomUtils.range(
            multiplier,
            Math.min(
                max,
                multiplier * (currentLevel + currentLevelUp)
            )
        )
        const [_, count] = await InventoryItemService.use(chatId, id, 'levelBoost')

        return Math.ceil(rawExperience * (1 + (count * LEVEL_BOOST / 100)))
    }

    private async _getWorkQuests(): Promise<Record<ClassTypes, string[]>> {
        return await FileUtils.readJsonFromResource<Record<ClassTypes, string[]>>('json/other/work_types.json') ??
            ClassUtils.getArray()
    }

    private async _getWorkTime(chatId: number, id: number) {
        const [hasCatalog] = await InventoryItemService.use(chatId, id, 'workCatalog')
        return WORK_TIME / (hasCatalog ? CATALOG_BOOST : 1)
    }

    private async _getQuest(chatId: number, id: number) {
        const workTypes = await this._getWorkQuests()
        const isUnknown = RandomUtils.halfChance()

        const userClass = await UserClassService.get(chatId, id)
        const quests = workTypes[isUnknown ? ClassUtils.defaultClassName : userClass]
        return RandomUtils.choose(quests) ?? 'Неизвестный квест'
    }

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const user = await ContextUtils.getUser(chatId, id)
        const isPrivate = ctx.chat.type == 'private'

        if(!isPrivate && await ChatSettingsService.get<'boolean'>(chatId, 'cantWorkInChat')) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/work/deny.pug',
                {
                    changeValues: {
                        user
                    }
                }
            )
            return
        }

        const workTime = await this._getWorkTime(chatId, id)
        const quest = await this._getQuest(chatId, id)
        const elapsed = await WorkTimeService.getElapsedTime(chatId, id, workTime)

        const isSendMessage = await GrindSettingService.isSendMessage(ctx, id)

        if (!elapsed) {
            const totalMoney = await this._getTotalMoney(chatId, id)
            const experience = await this._getExperience(chatId, id)
            const newLevel = await ExperienceService.isLevelUpAfterAdding(chatId, id, experience)

            await CasinoAddService.money(chatId, id, totalMoney)
            if(!isSendMessage) return
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

            if (newLevel) {
                await CasinoAddService.money(chatId, id, newLevel * LEVEL_UP_MONEY)
                if(!isSendMessage) return
                await LevelUtils.sendLevelUpMessage(ctx, newLevel)
            }
        }
        else {
            if(!isSendMessage) return
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