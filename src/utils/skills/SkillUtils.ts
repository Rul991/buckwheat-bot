import AttackMethod from '../../classes/duels/skill-methods/AttackMethod'
import DamageMethod from '../../classes/duels/skill-methods/DamageMethod'
import DeleteEffectMethod from '../../classes/duels/skill-methods/DeleteEffectMethod'
import DeleteEffectsMethod from '../../classes/duels/skill-methods/DeleteEffectsMethod'
import DuelistFieldAddMethod from '../../classes/duels/skill-methods/DuelistFieldAddMethod'
import DuelistFieldHasntEffectMethod from '../../classes/duels/skill-methods/DuelistFieldHasntEffectMethod'
import EffectHasEffectMethod from '../../classes/duels/skill-methods/EffectHasEffectMethod'
import EffectLastStepMethod from '../../classes/duels/skill-methods/EffectLastStepMethod'
import EffectLevelMethod from '../../classes/duels/skill-methods/EffectLevelMethod'
import EffectMethod from '../../classes/duels/skill-methods/EffectMethod'
import InstantKillMethod from '../../classes/duels/skill-methods/InstantKillMethod'
import LostHpDamageMethod from '../../classes/duels/skill-methods/LostHpDamageMethod'
import MoneyMethod from '../../classes/duels/skill-methods/MoneyMethod'
import MoneyStepMethod from '../../classes/duels/skill-methods/MoneyStepMethod'
import NoHpHealMethod from '../../classes/duels/skill-methods/NoHpHealMethod'
import PrecentDamage from '../../classes/duels/skill-methods/PrecentDamage'
import PrecentDuelistFieldMethod from '../../classes/duels/skill-methods/PrecentDuelistFieldMethod'
import RandomDamageMethod from '../../classes/duels/skill-methods/RandomDamageMethod'
import RemoveSkillMethod from '../../classes/duels/skill-methods/RemoveSkillMethod'
import ReturnDamageMethod from '../../classes/duels/skill-methods/ReturnDamageMethod'
import SkillMethod from '../../classes/duels/skill-methods/SkillMethod'
import SkipStepMethod from '../../classes/duels/skill-methods/SkipStepMethod'
import UseSkillIndexMethod from '../../classes/duels/skill-methods/UseSkillIndexMethod'
import Skill from '../../interfaces/duel/Skill'
import FileUtils from '../FileUtils'
import LevelUtils from '../level/LevelUtils'
import { ATTACK_SKILL_NAME_PART, HP_SYMBOLS, MANA_SYMBOLS } from '../values/consts'
import { CharactersMap, ClassTypes, DuelFilename } from '../values/types/types'
import ObjectValidator from '../ObjectValidator'
import { jsonSkillSchema } from '../values/schemas'
import Logging from '../Logging'
import { ExecuteSkillMethodOptions, ExecuteSkillOptions, ExecuteTarget, GetTextSkillOptions, MethodExecuteOptions } from '../values/types/skills'
import { basename, join } from 'path'
import DuelUtils from '../duel/DuelUtils'

type SkillContainer = Map<string, Skill>
type CharacterSkillContainer = Map<ClassTypes, Skill[]>

type SetupOptions = {
    characters: CharactersMap
    container: SkillContainer
    characterContainer: CharacterSkillContainer
    path: string
    skillKey: 'showable' | 'effects'
}

export default class SkillUtils {
    private static readonly _skillsFolder = 'json/duels/skills'
    private static readonly _effectsFolder = 'json/duels/effects'

    private static _methods: Record<string, SkillMethod<any>> = {
        attack: new AttackMethod,
        effect: new EffectMethod,
        damage: new DamageMethod,
        precentDamage: new PrecentDamage,
        randomDamage: new RandomDamageMethod,
        heal: new DuelistFieldAddMethod(HP_SYMBOLS.full, 'hp'),
        mana: new DuelistFieldAddMethod(MANA_SYMBOLS.full, 'mana'),
        precentHeal: new PrecentDuelistFieldMethod(HP_SYMBOLS.full, 'hp'),
        precentMana: new PrecentDuelistFieldMethod(MANA_SYMBOLS.full, 'mana'),
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
        manaHasntEffect: new DuelistFieldHasntEffectMethod(MANA_SYMBOLS.full, 'mana'),
        effectHasEffect: new EffectHasEffectMethod(true),
        effectHasntEffect: new EffectHasEffectMethod(false),
        deleteEffect: new DeleteEffectMethod,
        deleteEffects: new DeleteEffectsMethod,
        returnDamage: new ReturnDamageMethod,
    }

    private static _characterSkills: CharacterSkillContainer = new Map()
    private static _characterEffects: CharacterSkillContainer = new Map()

    private static _effects: SkillContainer = new Map()
    private static _skills: SkillContainer = new Map()
    private static _totalSkills: SkillContainer = new Map()

    private static async _loadFromFile(filename: string): Promise<Skill> {
        const json = await FileUtils.readJsonFromResource(
            filename
        )

        if (!ObjectValidator.isValidatedObject(json, jsonSkillSchema)) {
            return this.getDummy()
        }

        const title = json.info.title
        return {
            ...json,
            id: basename(filename, '.json'),
            alwaysUsable: title.startsWith(ATTACK_SKILL_NAME_PART)
        }
    }

    static getDummy(): Skill {
        return {
            id: '',
            level: LevelUtils.max + 1,
            info: {
                title: '',
                description: ''
            },
            execute: {
                user: [],
                enemy: []
            }
        }
    }

    private static async _setup({
        characters,
        container,
        characterContainer,
        path,
        skillKey
    }: SetupOptions) {
        const filenames = await FileUtils.readFilesFromResourse(path)
        const skills = await Promise.all(
            filenames.map(async filename => {
                return await this._loadFromFile(join(path, filename))
            })
        )

        for (const skill of skills) {
            const id = skill.id

            container.set(
                id,
                skill
            )

            this._totalSkills.set(
                id,
                skill
            )
        }

        characters.forEach((value, key) => {
            const skillNames = value.skill[skillKey]
            const skills = skillNames.map(
                id => this.getSkillById(id)
            )

            characterContainer.set(key, skills)
        })

        Logging.log(
            'SkillUtils._setup',
            {
                filename: path,
                skills: Array.from(container.entries()),
                characters: Array.from(characterContainer.entries())
            }
        )
    }

    static async setup(characters: CharactersMap) {
        await this._setup({
            characters,
            container: this._skills,
            characterContainer: this._characterSkills,
            path: this._skillsFolder,
            skillKey: 'showable'
        })

        await this._setup({
            characters,
            container: this._effects,
            characterContainer: this._characterEffects,
            path: this._effectsFolder,
            skillKey: 'effects'
        })
    }

    static getEffects(type?: ClassTypes): Skill[] {
        const effects = type ?
            this._characterEffects.get(type) ?? [] :
            this._effects.values()

        return Array.from(effects)
    }

    static getAvailableSkills(filename: DuelFilename, level: number): Skill[] {
        const characterSkills: Skill[] = this._characterSkills.get(filename) ?? []
        const result = characterSkills
            .filter(skill => level >= skill.level)

        return result
    }

    static getSkillById(id: string): Skill {
        return this._totalSkills.get(id) ?? this.getDummy()
    }

    private static _getId(key: ExecuteTarget, userId: number, enemyId: number) {
        const isUser = key == 'user'
        const id = isUser ? userId : enemyId

        return id
    }

    private static async _executeMethods(options: ExecuteSkillMethodOptions) {
        let result = true
        const {
            userId,
            enemyId,
            skill,
            executeType,
            attack,
            stopOnFailCheck = false
        } = options

        for (const rawKey in skill.execute) {
            const key = rawKey as ExecuteTarget
            const skillExecutes = skill.execute[key]
            const id = this._getId(key, userId, enemyId)

            for (const skillExecute of skillExecutes) {
                const {
                    name,
                    args
                } = skillExecute

                const method = this._methods[name]
                if (!method) continue

                const isValidated = method.validateArgs(args)
                if (!isValidated) continue

                const boost = method.getBoost(attack)
                const methodOptions: MethodExecuteOptions<any> = {
                    ...options,
                    id,
                    args,
                    boost
                }
                const executeResult = await method[executeType](methodOptions)

                if (!executeResult) {
                    if (stopOnFailCheck) {
                        return false
                    }
                    else {
                        result = false
                    }
                }
            }
        }

        return result
    }

    private static _getSkillByIdOrSkill(rawSkill: ExecuteSkillOptions['skill']) {
        return typeof rawSkill == 'string' ?
            this.getSkillById(rawSkill) :
            rawSkill
    }

    static async precheckSkill(options: ExecuteSkillOptions) {
        const skill = this._getSkillByIdOrSkill(options.skill)

        return await this._executeMethods({
            ...options,
            skill,
            executeType: 'preCheck',
            stopOnFailCheck: true
        })
    }

    static async executeSkill(options: ExecuteSkillOptions) {
        const skill = this._getSkillByIdOrSkill(options.skill)

        return await this._executeMethods({
            ...options,
            skill,
            executeType: 'execute',
            stopOnFailCheck: false
        })
    }

    static async useSkill(options: ExecuteSkillOptions) {
        const isCanUse = await this.precheckSkill(options)
        if (!isCanUse) return false

        await this.executeSkill(options)
        return true
    }

    static async getTextsSkill(options: GetTextSkillOptions) {
        const {
            chatId,
            userId,
            bold = true,
            isSecret = false,
            duel = DuelUtils.getDummy(chatId, userId)
        } = options
        if(isSecret) return ''

        const texts: Record<ExecuteTarget, string[]> = {
            user: [],
            enemy: []
        }

        for (const rawKey in options.skill.execute) {
            const key = rawKey as ExecuteTarget
            const skillExecutes = options.skill.execute[key]
            const id = this._getId(key, options.userId, options.enemyId)

            for (const skillExecute of skillExecutes) {
                const {
                    name,
                    args
                } = skillExecute

                const method = this._methods[name]
                if (!method) continue

                const boost = method.getBoost(options.attack)

                texts[key].push(
                    await method.getText({
                        ...options,
                        args,
                        id,
                        boost,
                        duel
                    })
                )
            }
        }

        return await FileUtils.readPugFromResource(
            'text/commands/skills/skill-effects.pug',
            {
                changeValues: {
                    enemyTexts: texts.enemy,
                    userTexts: texts.user,
                    bold    
                }
            }
        )
    }
}