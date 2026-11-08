import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelSkillUseButtonData, DuelSkillUseButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import DuelStepService from "../../../../db/services/duel/DuelStepService"
import SkillRegistry from "../../../../utils/duel/skill/SkillRegistry"
import SelectedSkillsService from "../../../../db/services/duel/SelectedSkillsService"
import SkillExecutor from "../../../../utils/duel/skill/SkillExecutor"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import SkillPresenter from "../../../../utils/duel/skill/SkillPresenter"
import DuelStep from "../../../../db/entities/duel/DuelStep"
import DuelistService from "../../../../db/services/duel/DuelistService"
import LevelService from "../../../../db/services/level/LevelService"
import BalanceService from "../../../../db/services/money/BalanceService"
import UserService from "../../../../db/services/user/UserService"
import type { MethodParticipant } from "../../../../types/skill-methods"
import LazyValue from "../../../../utils/cache/LazyValue"
import DuelUtils from "../../../../utils/duel/duel/DuelUtils"
import DuelService from "../../../../db/services/duel/DuelService"
import DuelPresenter from "../../../../utils/duel/duel/DuelPresenter"
import AdminUtils from "../../../../utils/bot/AdminUtils"
import DuelEffectService from "../../../../db/services/duel/DuelEffectService"

class DuelSkillUseButton extends CallbackQueryAction<DuelSkillUseButtonData> {
    override schema: GenMessage<DuelSkillUseButtonData> = DuelSkillUseButtonDataSchema
    override defaultTextKey: string = 'duel/button/use'
    override minimumRank: number = RankUtils.min
    override settingId: number = 196
    override name: string = 'duelskilluse'

    protected override async _getId(options: CallbackQueryActionOptions<DuelSkillUseButtonData>): Promise<number | number[] | undefined> {
        return await options.ctx.vars.duel.currentDuelist.get()
    }

    protected override async _execute(options: CallbackQueryActionOptions<DuelSkillUseButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            chatId,
            id
        } = options

        const {
            skillId
        } = data

        const skill = SkillRegistry.get(skillId)
        if (!skill) {
            return {
                key: 'skills/message/not-exist'
            }
        }

        const level = await ctx.vars.level.get()
        const user = await ctx.vars.user.require()
        const className = user.className

        const canUse = await SelectedSkillsService.canUse({
            chatId,
            id,
            skill,
            level,
            className
        })
        if (!canUse) {
            return {
                key: 'duel/message/use/cant',
                vars: {
                    skill: skill.getTitle(ctx)
                }
            }
        }

        const duel = await ctx.vars.duel.duel.require()
        const currentStep = await ctx.vars.duel.currentStep.get()
        const duelist = currentStep?.nextDuelist ?? await ctx.vars.duel.currentDuelist.get()
        ctx.vars.duel.currentStep.set(
            await DuelStepService.create(
                new DuelStep({
                    duelist,
                    chatId,
                    duel,
                })
            )
        )
        ctx.vars.duel.currentDuelist.update()

        const casterId = ctx.vars.id
        const enemyId = DuelUtils.getEnemy(duel, casterId)

        const caster: MethodParticipant = {
            id: casterId,
            user: ctx.vars.user,
            duelist: ctx.vars.duelist,
            level: ctx.vars.level,
            balance: ctx.vars.balance
        }

        const enemy: MethodParticipant = {
            id: enemyId,
            user: new LazyValue(() => UserService.get(chatId, enemyId)),
            duelist: new LazyValue(() => DuelistService.get(chatId, enemyId)),
            level: new LazyValue(() => LevelService.getCurrentLevel(chatId, enemyId)),
            balance: new LazyValue(() => BalanceService.get(chatId, enemyId))
        }

        const effects = await DuelEffectService.getAllByChatId(chatId)
        for (const effect of effects) {
            const {
                skillId,
                target: targetId,
                caster: casterId
            } = effect

            const skill = SkillRegistry.get(skillId)
            if(!skill) continue

            await SkillExecutor.execute({
                ctx,
                target: targetId == caster.id ? caster : enemy,
                caster: casterId == caster.id ? caster : enemy,
                skill
            })
        }
        await DuelEffectService.step(chatId)

        const executeResult = await SkillExecutor.execute({
            skill,
            ctx,
            caster,
            target: enemy
        })

        if (!executeResult.ok) {
            await DuelStepService.deleteCurrent(chatId)
            ctx.vars.duel.currentStep.update()
            ctx.vars.duel.currentDuelist.update()

            return {
                key: executeResult.failKey,
                isAlert: true
            }
        }

        const loser = await DuelService.whoLose(chatId)
        if (loser) {
            const winner = DuelUtils.getEnemy(duel, loser)
            const {
                experience,
                prize
            } = await DuelService.end(chatId, winner)

            const {
                key,
                options: messageOptions
            } = await DuelPresenter.end({
                winner,
                loser: id,
                prize,
                experience,
                ctx
            })

            await Promise.all([
                MessageUtils.deleteMessages(ctx),
                MessageUtils.reply(
                    ctx,
                    key,
                    messageOptions
                ),
                AdminUtils.gameKick({
                    ctx,
                    chatId,
                    id: loser,
                })
            ])
            return
        }

        const { datas, attack } = executeResult
        const {
            key,
            options: messageOptions
        } = await SkillPresenter.attack({
            attack,
            ctx,
            skill,
            casterDatas: datas.caster,
            targetDatas: datas.target
        })
        await Promise.all([
            MessageUtils.deleteMessages(ctx),
            MessageUtils.reply(
                ctx,
                key,
                messageOptions
            )
        ])
    }
}

export default new DuelSkillUseButton()
