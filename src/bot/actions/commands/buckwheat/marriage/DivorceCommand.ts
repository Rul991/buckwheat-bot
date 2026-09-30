import Marriage from "../../../../../db/entities/marriage/Marriage"
import MarriageService from "../../../../../db/services/marriage/MarriageService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class DivorceCommand extends BuckwheatCommand {
    override aliases: string[] = ['развод', 'расстаться']
    override filename: string = 'divorce'
    override minimumRank: number = RankUtils.min
    override settingId: number = 105
    override name: string = 'развестись'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            ctx
        } = options

        const user = await ctx.vars.user.get()
        const marriage = await MarriageService.get(chatId, id)

        if(!marriage) {
            return {
                key: 'marriage/divorce/no-partner',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }

        const partnerId = marriage ?
            Marriage.getPartner(marriage, id) :
            undefined
        const partner = partnerId ?
            partnerId == id ? user : await UserService.get(chatId, partnerId) :
            undefined

        await MarriageService.delete(
            chatId,
            id
        )

        return {
            key: 'marriage/divorce/divorce',
            options: {
                vars: {
                    user,
                    partner
                }
            }
        }
    }
}