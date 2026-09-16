import { IS_PROD } from "../../../../../consts/env"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ClassUtils from "../../../../../utils/db/ClassUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import { classesKeyboard } from "../../../../keyboards/user"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ClassCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override minimumRank: number = RankUtils.min
    override name: string = 'класс'
    override filename: string = 'class'
    override settingId: number = 15

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options
        
        const user = ctx.vars.user
        const changeCount = user?.classChangedCount ?? 0
        const type = user?.className ?? ClassUtils.defaultClassName
        const isPlayer = ClassUtils.isPlayer(type)

        if(IS_PROD && isPlayer) {
            return {
                key: 'classes/show',
                options: {
                    vars: {
                        type,
                        name: ClassUtils.getName(ctx, type),
                        changeCount
                    }
                }
            }
        }

        return {
            key: 'classes/change',
            options: {
                keyboard: await classesKeyboard(ctx, id)
            }
        }
    }
}