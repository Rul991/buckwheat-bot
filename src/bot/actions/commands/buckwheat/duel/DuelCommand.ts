import { MAX_DUEL_PRIZE, MIN_DUEL_PRIZE } from "../../../../../consts/number"
import DuelistService from "../../../../../db/services/duel/DuelistService"
import DuelService from "../../../../../db/services/duel/DuelService"
import SelectedSkillsService from "../../../../../db/services/duel/SelectedSkillsService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import MathUtils from "../../../../../utils/math/MathUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import { duelStartKeyboard } from "../../../../keyboards/duel"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class DuelCommand extends BuckwheatCommand {
    private readonly _defaultPrize = 1000

    override aliases: string[] = ['вызов', 'поединок']
    override filename: string = 'duel'
    override minimumRank: number = RankUtils.min
    override settingId: number = 189
    override name: string = 'дуэль'
    override needData: boolean = true
    override isSupportReply: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            replyFrom,
            other = this._defaultPrize.toString()
        } = options

        if(!replyFrom) {
            return {
                key: 'duel/message/reply/no'
            }
        }

        const replyId = replyFrom.id
        if(replyId == id) {
            return {
                key: 'duel/message/reply/self'
            }
        }

        const replyUser = await UserService.get(chatId, replyId)
        if(replyFrom.is_bot) {
            return {
                key: 'duel/message/reply/bot',
                options: {
                    vars: {
                        reply: replyUser
                    }
                }
            }
        }

        const duel = await ctx.vars.duel.duel.get()
        if(duel) {
            return {
                key: 'duel/message/already-exist'
            }
        }

        const rawInputPrize = StringUtils.getNumberFromString(other, this._defaultPrize)
        const inputPrize = MathUtils.clamp(
            rawInputPrize,
            MIN_DUEL_PRIZE,
            MAX_DUEL_PRIZE
        )

        const userDuelist = await ctx.vars.duelist.require()
        const userSelectedSkills = await SelectedSkillsService.getSkills(chatId, id)

        const replyDuelist = await DuelistService.get(chatId, replyId)
        const replySelectedSkills = await SelectedSkillsService.getSkills(chatId, replyId)

        const {
            first: userPrize,
            second: replyPrize,
            total: prize
        } = await DuelService.getPrizes({
            chatId,
            first: id,
            second: replyId,
            prize: inputPrize
        })

        const userOptions = {
            user: await ctx.vars.user.require(),
            hp: userDuelist.hp,
            mana: userDuelist.mana,
            skills: userSelectedSkills.length,
            prize: userPrize
        }

        const replyOptions = {
            user: replyUser,
            hp: replyDuelist.hp,
            mana: replyDuelist.mana,
            skills: replySelectedSkills.length,
            prize: replyPrize
        }

        return {
            key: 'duel/message/start',
            options: {
                vars: {
                    duelistOptions: {
                        user: userOptions,
                        reply: replyOptions
                    }
                },
                keyboard: await duelStartKeyboard(
                    ctx,
                    {
                        reply: replyId,
                        suggester: id,
                        prize
                    }
                )
            }
        }
    }
}