import InventoryItemService from "../../../../../db/services/items/InventoryItemService"
import LevelService from "../../../../../db/services/level/LevelService"
import BalanceService from "../../../../../db/services/money/BalanceService"
import WorkService from "../../../../../db/services/work/WorkService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import ExperienceUtils from "../../../../../utils/level/ExperienceUtils"
import TimeUtils from "../../../../../utils/time/TimeUtils"
import WorkUtils from "../../../../../utils/work/WorkUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class WorkCommand extends BuckwheatCommand {
    override aliases: string[] = ['работать', 'ворк', 'фарма', 'фарм', 'ферма', 'работка']
    override minimumRank: number = RankUtils.min
    override settingId: number = 49
    override name: string = 'работа'
    override filename: string = 'work'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
        } = options

        const canWorkResult = await WorkService.canWork(chatId, id)
        const {
            ok: canWork,
            remainingTime
        } = canWorkResult

        if (!canWork) {
            return {
                key: 'work/cant-work',
                options: {
                    vars: {
                        time: TimeUtils.formatMillisecondsToTime(
                            ctx,
                            remainingTime
                        ),
                    }
                }
            }
        }

        const user = ctx.vars.user
        const level = ExperienceUtils.getLevelFromObject(ctx.vars.level)
        const inventory = await InventoryItemService.getInventory(chatId, id)

        const money = WorkUtils.getMoney(inventory)
        const experience = WorkUtils.getExperience(
            level,
            inventory
        )

        const quest = WorkUtils.getQuest(ctx, user?.className)
        const item = await InventoryItemService.getRandomItem(chatId, id)

        await Promise.all([
            BalanceService.add({ chatId, id, money }),
            LevelService.add(chatId, id, experience),
            WorkService.updateTime(chatId, id),
        ])

        if (item) {
            await InventoryItemService.add({
                chatId,
                id,
                item
            })
        }

        return {
            key: 'work/work',
            options: {
                vars: {
                    user,
                    quest,
                    item: item?.getVars(ctx),
                    experience,
                    money
                }
            }
        }
    }
}