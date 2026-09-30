import DuelistService from "../../../../../db/services/duel/DuelistService"
import SelectedGunService from "../../../../../db/services/gun/SelectedGunService"
import UserService from "../../../../../db/services/user/UserService"
import { characters } from "../../../../../resources/duels/characters/characters"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ClassUtils from "../../../../../utils/db/ClassUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import ItemUtils from "../../../../../utils/items/ItemUtils"
import ExperienceUtils from "../../../../../utils/level/ExperienceUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class CharsCommand extends BuckwheatCommand {
    override aliases: string[] = ['хп', 'мана']
    override filename: string = 'chars'
    override minimumRank: number = RankUtils.min
    override settingId: number = 68
    override name: string = 'характеристики'
    override isSupportReply: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            replyOrUserFrom,
            id,
            chatId
        } = options

        const replyId = replyOrUserFrom.id
        const isSelf = replyId == id

        const user = isSelf ? await ctx.vars.user.get() : await UserService.get(chatId, replyId)
        const level = await ctx.vars.level.get()

        const className = user?.className ?? ClassUtils.defaultClassName
        const isPlayer = ClassUtils.isPlayer(className)

        if(!isPlayer) {
            return {
                key: 'universal/must-choose-class',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }
        
        const duelist = isSelf ? await ctx.vars.duelist.get() : await DuelistService.get(chatId, replyId)
        const character = characters[className]
        
        const levelNumber = ExperienceUtils.getLevelFromObject(level)
        const maxChars = character.getMaxCharacteristics(levelNumber)

        const selectedGun = await SelectedGunService.get(
            chatId,
            replyId
        )
        const gun = selectedGun.selectedGun ?
            ItemUtils.get(selectedGun.selectedGun) :
            undefined

        return {
            key: 'chars/info',
            options: {
                vars: {
                    user,
                    currentChars: duelist,
                    maxChars,
                    classVars: ClassUtils.getVars(ctx, className),
                    level: levelNumber,
                    gun: gun?.getVars(ctx)
                }
            }
        }
    }
}