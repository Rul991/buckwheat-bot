import DuelistService from "../../../../../db/services/duel/DuelistService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import ClassUtils from "../../../../../utils/db/ClassUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import DuelistUtils from "../../../../../utils/duel/DuelistUtils"
import ExperienceUtils from "../../../../../utils/level/ExperienceUtils"
import TimeUtils from "../../../../../utils/time/TimeUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SaveCommand extends BuckwheatCommand {
    override aliases: string[] = ['сохранится', 'сейв']
    override minimumRank: number = RankUtils.min
    override settingId: number = 67
    override name: string = 'сохраниться'
    override filename: string = 'save'
    override needData: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            other
        } = options

        const user = ctx.vars.user
        const className = user?.className ?? ClassUtils.defaultClassName
        const duelist = ctx.vars.duelist

        const level = ExperienceUtils.getLevelFromObject(ctx.vars.level)
        const isPlayer = ClassUtils.isPlayer(className)

        const mustKicked = other == ctx.t('save/kick-command')
        const isKicked = mustKicked && await AdminUtils.kick(ctx, id)

        if (!isPlayer && isKicked) {
            return {
                key: 'save/not-player-kicked',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }
        else if(!isPlayer) {
            return {
                key: 'universal/must-choose-class',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }

        const {
            isCan: canSave,
            remainingTime
        } = DuelistUtils.canSave(duelist)
        if(!canSave) {
            return {
                key: 'save/early-save',
                options: {
                    vars: {
                        user,
                        remainingTime: TimeUtils.formatMillisecondsToTime(ctx, remainingTime),
                        isKicked,
                        mustKicked
                    }
                }
            }
        }

        await DuelistService.save({
            chatId,
            id,
            className,
            level
        })

        return {
            key: 'save/saved',
            options: {
                vars: {
                    user,
                    isKicked,
                    mustKicked
                }
            }
        }
    }
}