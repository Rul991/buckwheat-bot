import LevelService from '../classes/db/services/level/LevelService'
import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import UserClassService from '../classes/db/services/user/UserClassService'
import AttackMethod from '../classes/skill-methods/AttackMethod'
import DamageMethod from '../classes/skill-methods/DamageMethod'
import DeleteEffectMethod from '../classes/skill-methods/DeleteEffectMethod'
import DeleteEffectsMethod from '../classes/skill-methods/DeleteEffectsMethod'
import DuelistFieldAddMethod from '../classes/skill-methods/DuelistFieldAddMethod'
import DuelistFieldHasntEffectMethod from '../classes/skill-methods/DuelistFieldHasntEffectMethod'
import EffectHasEffectMethod from '../classes/skill-methods/EffectHasEffectMethod'
import EffectLastStepMethod from '../classes/skill-methods/EffectLastStepMethod'
import EffectLevelMethod from '../classes/skill-methods/EffectLevelMethod'
import EffectMethod from '../classes/skill-methods/EffectMethod'
import InstantKillMethod from '../classes/skill-methods/InstantKillMethod'
import LostHpDamageMethod from '../classes/skill-methods/LostHpDamageMethod'
import MoneyMethod from '../classes/skill-methods/MoneyMethod'
import MoneyStepMethod from '../classes/skill-methods/MoneyStepMethod'
import NoHpHealMethod from '../classes/skill-methods/NoHpHealMethod'
import PrecentDamage from '../classes/skill-methods/PrecentDamage'
import PrecentDuelistFieldMethod from '../classes/skill-methods/PrecentDuelistFieldMethod'
import RandomDamageMethod from '../classes/skill-methods/RandomDamageMethod'
import RemoveSkillMethod from '../classes/skill-methods/RemoveSkillMethod'
import ReturnDamageMethod from '../classes/skill-methods/ReturnDamageMethod'
import SkillMethod from '../classes/skill-methods/SkillMethod'
import SkipStepMethod from '../classes/skill-methods/SkipStepMethod'
import UseSkillIndexMethod from '../classes/skill-methods/UseSkillIndexMethod'
import SkillAttack from '../enums/SkillAttack'
import Skill from '../interfaces/duel/Skill'
import ClassUtils from './ClassUtils'
import DuelUtils from './DuelUtils'
import FileUtils from './FileUtils'
import Logging from './Logging'
import { HP_SYMBOLS, MANA_SYMBOLS } from './values/consts'
import { CallbackButtonContext, ClassTypes, DuelFilename, JavascriptTypes, UseSkillOptions } from './values/types/types'

type MethodName = 'preCheck' | 'execute'
type SkillMethodName = 'cost' | 'execute'

type UseMethodOptions<A extends any[], S extends string> = {
    name: S
    args: A
    ctx: CallbackButtonContext
    chatId: number
    skill: Skill
    id: number
    userId: number
    enemyId: number
    attack: SkillAttack
}

type GetTextsOptions = {
    skill: Skill
    method: SkillMethodName
    ctx: CallbackButtonContext
    isSecret?: boolean
    attack?: SkillAttack
}

type UseSkillResult = {
    isUsed: boolean
}

export default class SkillUtils {
    private static _methods: Record<string, SkillMethod<any>> = {
        attack: new AttackMethod,
        effect: new EffectMethod,
        damage: new DamageMethod,
        precentDamage: new PrecentDamage,
        randomDamage: new RandomDamageMethod,
        heal: new DuelistFieldAddMethod(HP_SYMBOLS.FULL, 'hp'),
        mana: new DuelistFieldAddMethod(MANA_SYMBOLS.FULL, 'mana'),
        precentHeal: new PrecentDuelistFieldMethod(HP_SYMBOLS.FULL, 'hp'),
        precentMana: new PrecentDuelistFieldMethod(MANA_SYMBOLS.FULL, 'mana'),
        lostHpDamage: new LostHpDamageMethod,
        instantKill: new InstantKillMethod,
        noHpHeal: new NoHpHealMethod,
        skipStep: new SkipStepMethod,
        money: new MoneyMethod,
        moneyStep: new MoneyStepMethod,
        effectLevel: new EffectLevelMethod,
        effectLastStep: new EffectLastStepMethod,
        removeSkill: new RemoveSkillMethod,
        useSkillIndex: new UseSkillIndexMethod,
        manaHasntEffect: new DuelistFieldHasntEffectMethod(MANA_SYMBOLS.FULL, 'mana'),
        effectHasEffect: new EffectHasEffectMethod(true),
        effectHasntEffect: new EffectHasEffectMethod(false),
        deleteEffect: new DeleteEffectMethod,
        deleteEffects: new DeleteEffectsMethod,
        returnDamage: new ReturnDamageMethod,
    }

    private static _validateArgs<A extends any[]>(methodArgs: JavascriptTypes[], args: A): args is A {
        return methodArgs.reduce((prev, curr, i) => {
            if (!prev) return prev
            return curr == typeof args[i]
        }, true)
    }

    private static async _useMethod<
        A extends any[],
        S extends keyof typeof SkillUtils._methods = keyof typeof SkillUtils._methods
    >({
        name,
        args,
        ctx,
        skill,
        id,
        chatId,
        methodName,
        attack,
        userId,
        enemyId
    }: UseMethodOptions<A, S> & { methodName: MethodName }): Promise<boolean> {
        const method = this._methods[name]
        if (!method) {
            Logging.warn('_useMethod: method not exist', name)
            return false
        }

        if (!this._validateArgs(method.args, args)) {
            Logging.warn('_useMethod: cant validate', name, method.args, args)
            return false
        }

        const options = {
            args,
            ctx,
            chatId,
            skill,
            id,
            attack,
            userId,
            enemyId
        }

        return await method[methodName](options)
    }

    static async getTotalDamage({ skill, ctx, userId, enemyId, attack }: UseSkillOptions) {
        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return 0

        let result = 0

        for (const {name, args} of skill.execute) {
            const method = this._methods[name]
            if (!method) continue

            if (!this._validateArgs(method.args, args)) {
                continue
            }

            if(method instanceof DamageMethod) {
                const options = {
                    skill,
                    id: skill.onEnemy ? enemyId : userId,
                    chatId,
                    ctx,
                    name: name as any,
                    args: args as any,
                    methodName: 'execute',
                    userId,
                    enemyId,
                    attack,
                    isText: false
                }
                const damage = await method.getDamage(options)
                result += damage
            }
        }

        return result
    }

    static async useSkill({ skill, ctx, userId, enemyId, attack }: UseSkillOptions): Promise<UseSkillResult> {
        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if (!chatId) {
            Logging.warn('useSkill: wrong chatId', ctx.chat, chatId)
            return {isUsed: false}
        }

        const spellsEach = async (
            methodName: MethodName,
            isCost: boolean
        ): Promise<boolean> => {
            const id = isCost || !skill.onEnemy ? userId : enemyId
            for (const { args, name } of isCost ? skill.cost : skill.execute) {
                const isUsed = await this._useMethod({
                    skill,
                    id,
                    chatId,
                    ctx,
                    name: name as any,
                    args,
                    methodName,
                    userId,
                    enemyId,
                    attack: isCost ? SkillAttack.Normal : attack
                })

                if (!isUsed) return false
            }

            return true
        }

        if (!await spellsEach('preCheck', true)) return {isUsed: false}
        if (!await spellsEach('preCheck', false)) return {isUsed: false}

        !await spellsEach('execute', true)
        !await spellsEach('execute', false)

        return {isUsed: true}
    }

    static async getTexts({
        skill,
        method,
        ctx,
        isSecret,
        attack = SkillAttack.Normal
    }: GetTextsOptions): Promise<string[]> {
        const methods = skill[method]

        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return []

        const result: string[] = []

        for await (const { name, args } of methods) {
            if (!this._methods[name]) continue

            const isExecute = method == 'execute'
            const text = await this._methods[name].getText({
                args,
                id,
                chatId,
                skill: isExecute ? skill : { ...skill, onEnemy: false },
                ctx,
                isExecute,
                attack,
                userId: id,
                enemyId: id,
                isSecret
            })
            result.push(text)
        }

        return result
    }

    static async getSkillsFromFile(filename: DuelFilename): Promise<Skill[]> {
        return (await DuelUtils.getCharacterFromFile(filename))?.skills ?? []
    }

    static async getUserSkillById(chatId: number, id: number, skillId: string) {
        const type = await UserClassService.get(chatId, id)
        return await this.getSkillById(type, skillId)
    }

    static async getAvailableSkills(chatId: number, id: number, type?: ClassTypes) {
        const level = await LevelService.get(chatId, id)
        const usedType = type ?? await UserClassService.get(chatId, id)

        const result = (await this.getSkillsFromFile(usedType))
            .filter(skill => level >= skill.level && !(skill.secret || skill.isEffect))

        return result
    }

    static async getSkillById(filename: DuelFilename, id: string): Promise<Skill | undefined> {
        const skills = await this.getSkillsFromFile(filename)
        return skills.find(skill => skill.id == id)
    }

    static async getViewText({
        isSecret,
        skill,
        ctx,
        classType
    }: {
        isSecret?: boolean
        skill: Skill
        ctx: CallbackButtonContext
        classType: ClassTypes
    }) {
        const getTexts = async (isCost: boolean) => (
            isSecret ? [] : await SkillUtils.getTexts({ skill, ctx, method: isCost ? 'cost' : 'execute' })
        )

        return await FileUtils.readPugFromResource(
            'text/commands/skills/view.pug',
            {
                changeValues: {
                    ...skill,
                    emoji: ClassUtils.getEmoji(classType),
                    costTexts: await getTexts(true),
                    executeTexts: await getTexts(false)
                }
            })
    }

    static async getViewParamsText(ctx: CallbackButtonContext, skill: Skill, isSecret = false, attack?: SkillAttack) {
        const costTexts = await SkillUtils.getTexts({ attack, isSecret, skill, ctx, method: 'cost' })
        const executeTexts = await SkillUtils.getTexts({ attack, isSecret, skill, ctx, method: 'execute' })
        const {
            description
        } = skill

        return await FileUtils.readPugFromResource(
            'text/actions/skill/view.pug',
            {
                changeValues: {
                    costTexts,
                    executeTexts,
                    description
                }
            }
        )
    }

    static isHideName(skill?: Skill): boolean {
        if (!skill) return false

        return Boolean(skill.secret && skill.isEffect)
    }
}