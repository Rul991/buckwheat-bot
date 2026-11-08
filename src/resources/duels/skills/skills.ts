import DamageLevelMethod from "../../../utils/duel/methods/damage/DamageLevelMethod"
import InstantKillDamageMethod from "../../../utils/duel/methods/damage/InstantKillDamageMethod"
import LostHealthDamageMethod from "../../../utils/duel/methods/damage/LostHealthDamageMethod"
import PercentDamageMethod from "../../../utils/duel/methods/damage/PercentDamageMethod"
import RandomDamageMethod from "../../../utils/duel/methods/damage/RandomDamageMethod"
import SimpleDamageMethod from "../../../utils/duel/methods/damage/SimpleDamageMethod"
import NoHpHealMethod from "../../../utils/duel/methods/heal/NoHpHealMethod"
import PercentHealMethod from "../../../utils/duel/methods/heal/PercentHealMethod"
import SimpleHealMethod from "../../../utils/duel/methods/heal/SimpleHealMethod"
import PercentManaMethod from "../../../utils/duel/methods/mana/PercentManaMethod"
import SimpleManaMethod from "../../../utils/duel/methods/mana/SimpleManaMethod"
import MoneyLevelMethod from "../../../utils/duel/methods/money/MoneyLevelMethod"
import SimpleMoneyMethod from "../../../utils/duel/methods/money/SimpleMoneyMethod"
import Skill from "../../../utils/duel/skill/Skill"

export const devSkill = new Skill({
    id: 0,
    level: 1,
    key: 'universal/dev',
    methods: {
        caster: [
            new NoHpHealMethod(0.1),
            new PercentHealMethod(0.1),
            new SimpleHealMethod(10),
            new PercentManaMethod(-0.1),
            new SimpleManaMethod(10),
        ],
        target: [
            new DamageLevelMethod({
                start: 1,
                up: 1
            }),
            new InstantKillDamageMethod(0.5),
            new LostHealthDamageMethod(100),
            new PercentDamageMethod(0.5),
            new RandomDamageMethod(0, 10),
            new SimpleDamageMethod(10),
            new MoneyLevelMethod({
                start: 1,
                up: 2
            }),
            new SimpleMoneyMethod(10)
        ]
    }
})

export const attackUniversalSkill = new Skill({
    id: 1,
    level: 1,
    key: 'universal/attack',
    methods: {
        caster: [],
        target: []
    }
})

export const attackBardSkill = new Skill({
    id: 2,
    level: 1,
    key: 'bard/attack',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({
                start: 8,
                up: 0.4
            }),
        ]
    }
})

export const attackEngineerSkill = new Skill({
    id: 3,
    level: 1,
    key: 'engineer/attack',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({
                start: 5,
                up: 0.35
            }),
        ]
    }
})

export const attackKnightSkill = new Skill({
    id: 4,
    level: 1,
    key: 'knight/attack',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({
                start: 15,
                up: 0.75
            }),
        ]
    }
})

export const attackSorcererSkill = new Skill({
    id: 5,
    level: 1,
    key: 'sorcerer/attack',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({
                start: 4,
                up: 0.3
            }),
        ]
    }
})

export const attackThiefSkill = new Skill({
    id: 6,
    level: 1,
    key: 'thief/attack',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({
                start: 10,
                up: 0.45
            }),
        ]
    }
})

export const attackBossSkill = new Skill({
    id: 7,
    level: 1,
    key: 'boss/attack',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({
                start: 15,
                up: 0.75
            }),
        ]
    }
})

export const brokenStringBardSkill = new Skill({
    id: 8,
    level: 1,
    key: 'bard/broken-string',
    methods: {
        caster: [],
        target: []
    }
})

export const skills: Skill[] = [
    devSkill,
    attackBardSkill,
    attackBossSkill,
    attackEngineerSkill,
    attackKnightSkill,
    attackSorcererSkill,
    attackThiefSkill,
    attackUniversalSkill,
]