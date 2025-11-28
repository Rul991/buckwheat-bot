import SkillAttack from '../../enums/SkillAttack'
import ReplaceOptions from '../../interfaces/options/ReplaceOptions'
import FileUtils from '../../utils/FileUtils'
import SkillUtils from '../../utils/SkillUtils'
import { UNKNOWN_EFFECT } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types/types'
import DuelService from '../db/services/duel/DuelService'
import EffectService from '../db/services/duel/EffectService'
import UserClassService from '../db/services/user/UserClassService'
import SkillMethod from './SkillMethod'

export default class<T extends any[] = [string, number]> extends SkillMethod<T> {
    protected _filename: string = 'effect'
    args: JavascriptTypes[] = ['string', 'number']

    protected async _preCheck({
        userId, 
        chatId, 
        args: [name, _steps]
    }: MethodExecuteArguments<T>): Promise<boolean> {
        const className = await UserClassService.get(chatId, userId)

        return Boolean(await SkillUtils.getSkillById(className, name))
    }

    protected async _getRawSteps({args: [_name, steps]}: MethodExecuteArguments<T>): Promise<number> {
        return steps
    }

    protected async _getRemainingSteps(options: MethodExecuteArguments<T>) {
        const {
            attack
        } = options
        const rawSteps = await this._getRawSteps(options)

        const boost = attack == SkillAttack.Crit ? 1.5 : 
            SkillAttack.Fail ? 0.5 : 
            1

        return Math.floor(rawSteps * boost)
    }

    protected async _getSkillName({args: [name]}: MethodExecuteArguments<T>): Promise<string> {
        return name
    }

    protected async _condition({}: MethodExecuteArguments<T>): Promise<boolean> {
        return true
    }

    protected async _getChangeValues(options: MethodExecuteArguments<T>): Promise<ReplaceOptions['changeValues']> {
        const { 
            chatId, 
            userId,
            skill: thisSkill,
            isSecret,
        } = options

        const name = await this._getSkillName(options)
        const steps = await this._getRemainingSteps(options)

        const className = await UserClassService.get(chatId, userId)
        const skill = await SkillUtils.getSkillById(className, name)
        
        const title = skill?.title ?? UNKNOWN_EFFECT
        const isHide = !!(SkillUtils.isHideName(skill) && isSecret)
        const onEnemy = thisSkill.onEnemy

        return {
            title,
            steps,
            isHide,
            onEnemy,
        }
    }

    async _execute(options: MethodExecuteArguments<T>): Promise<boolean> {
        const {
            userId, 
            id,
            chatId,
        } = options

        const duel = await DuelService.getByUserId(chatId, userId)
        if(!duel) return false
        const duelId = duel.id

        const isAddEffect = await this._condition(options)

        if(isAddEffect) {
            const name = await this._getSkillName(options)
            const remainingSteps = await this._getRemainingSteps(options)

            await EffectService.add(
                duelId, 
                {
                    name,
                    remainingSteps,
                    target: id,
                    sender: userId
                }
            )
        }

        return true
    }

    async getText(options: MethodExecuteArguments<T> & SkillMethodGetText): Promise<string> {
        return await FileUtils.readPugFromResource(
            `text/methods/${this._filename}.pug`,
            {
                changeValues: await this._getChangeValues(options)
            }
        )
    }
}