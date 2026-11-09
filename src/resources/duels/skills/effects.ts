import PercentDamageMethod from "../../../utils/duel/methods/damage/PercentDamageMethod"
import SimpleDamageMethod from "../../../utils/duel/methods/damage/SimpleDamageMethod"
import PercentHealMethod from "../../../utils/duel/methods/heal/PercentHealMethod"
import PercentManaMethod from "../../../utils/duel/methods/mana/PercentManaMethod"
import Skill from "../../../utils/duel/skill/Skill"

const START_EFFECT_ID = 200

export const mockeryEffect = new Skill({
    id: START_EFFECT_ID + 0,
    level: 1,
    key: 'effects/bard/mockery',
    methods: {
        caster: [],
        target: [new PercentDamageMethod(0.03)]
    }
})

export const inspiringMotifEffect = new Skill({
    id: START_EFFECT_ID + 1,
    level: 1,
    key: 'effects/bard/inspiring-motif',
    methods: {
        caster: [new PercentHealMethod(0.04)],
        target: []
    }
})

export const hymnOfResilienceEffect = new Skill({
    id: START_EFFECT_ID + 2,
    level: 1,
    key: 'effects/bard/hymn-of-resilience',
    methods: {
        caster: [new PercentHealMethod(0.06)],
        target: []
    }
})

export const deafenedEffect = new Skill({
    id: START_EFFECT_ID + 3,
    level: 1,
    key: 'effects/bard/deafened',
    methods: {
        caster: [],
        target: [new PercentDamageMethod(0.05)]
    }
})

export const turretEffect = new Skill({
    id: START_EFFECT_ID + 4,
    level: 1,
    key: 'effects/engineer/turret',
    methods: {
        caster: [],
        target: [new SimpleDamageMethod(4)]
    }
})

export const shockTrapEffect = new Skill({
    id: START_EFFECT_ID + 5,
    level: 1,
    key: 'effects/engineer/shock-trap',
    methods: {
        caster: [],
        target: [new PercentDamageMethod(0.04)]
    }
})

export const oilSlickEffect = new Skill({
    id: START_EFFECT_ID + 6,
    level: 1,
    key: 'effects/engineer/oil-slick',
    methods: {
        caster: [],
        target: [new PercentManaMethod(-0.03)]
    }
})

export const droneShieldEffect = new Skill({
    id: START_EFFECT_ID + 7,
    level: 1,
    key: 'effects/engineer/drone-shield',
    methods: {
        caster: [new PercentHealMethod(0.05)],
        target: []
    }
})

export const bleedEffect = new Skill({
    id: START_EFFECT_ID + 8,
    level: 1,
    key: 'effects/knight/bleed',
    methods: {
        caster: [],
        target: [new PercentDamageMethod(0.02)]
    }
})

export const knightRallyEffect = new Skill({
    id: START_EFFECT_ID + 9,
    level: 1,
    key: 'effects/knight/rally',
    methods: {
        caster: [new PercentHealMethod(0.04)],
        target: []
    }
})

export const burnEffect = new Skill({
    id: START_EFFECT_ID + 10,
    level: 1,
    key: 'effects/sorcerer/burn',
    methods: {
        caster: [],
        target: [new SimpleDamageMethod(4)]
    }
})

export const frostbiteEffect = new Skill({
    id: START_EFFECT_ID + 11,
    level: 1,
    key: 'effects/sorcerer/frostbite',
    methods: {
        caster: [],
        target: [new PercentDamageMethod(0.04)]
    }
})

export const poisonEffect = new Skill({
    id: START_EFFECT_ID + 12,
    level: 1,
    key: 'effects/thief/poison',
    methods: {
        caster: [],
        target: [new SimpleDamageMethod(4)]
    }
})

export const emberEffect = new Skill({
    id: START_EFFECT_ID + 13,
    level: 1,
    key: 'effects/thief/ember',
    methods: {
        caster: [],
        target: [new SimpleDamageMethod(3)]
    }
})

export const smokeBombEffect = new Skill({
    id: START_EFFECT_ID + 14,
    level: 1,
    key: 'effects/thief/smoke-bomb',
    methods: {
        caster: [new PercentHealMethod(0.04)],
        target: []
    }
})

export const venomTrapEffect = new Skill({
    id: START_EFFECT_ID + 15,
    level: 1,
    key: 'effects/thief/venom-trap',
    methods: {
        caster: [],
        target: [new PercentDamageMethod(0.03)]
    }
})

export const shadowCloakEffect = new Skill({
    id: START_EFFECT_ID + 16,
    level: 1,
    key: 'effects/thief/shadow-cloak',
    methods: {
        caster: [new PercentHealMethod(0.05)],
        target: []
    }
})

export const effects: Skill[] = [
    mockeryEffect,
    inspiringMotifEffect,
    hymnOfResilienceEffect,
    deafenedEffect,
    turretEffect,
    shockTrapEffect,
    oilSlickEffect,
    droneShieldEffect,
    bleedEffect,
    knightRallyEffect,
    burnEffect,
    frostbiteEffect,
    poisonEffect,
    emberEffect,
    smokeBombEffect,
    venomTrapEffect,
    shadowCloakEffect,
]