import Skill from "../../../utils/duel/skill/Skill"
import SimpleDamageMethod from "../../../utils/duel/methods/damage/SimpleDamageMethod"
import RandomDamageMethod from "../../../utils/duel/methods/damage/RandomDamageMethod"

// 2heff
export const twoHeffSkill = new Skill({
    id: 1001,
    level: 1,
    key: 'thief/2heff',
    methods: {
        caster: [
            // heal: [40]
        ],
        target: [
            new SimpleDamageMethod(60)
        ]
    }
})

// 2precent-heal
export const twoPercentHealSkill = new Skill({
    id: 1002,
    level: 35,
    key: 'bard/2precent-heal',
    methods: {
        caster: [],
        target: [
            // precentHeal: [2]
        ]
    }
})

// agony
export const agonySkill = new Skill({
    id: 1003,
    level: 1,
    key: 'bard/agony',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(50)
        ]
    }
})

// armor-used
export const armorUsedSkill = new Skill({
    id: 1004,
    level: 1,
    key: 'engineer/armor-used',
    methods: {
        caster: [],
        target: []
    }
})

// asucont
export const asucontSkill = new Skill({
    id: 1005,
    level: 1,
    key: 'thief/asucont',
    methods: {
        caster: [],
        target: [
            // precentDamage: [25]
        ]
    }
})

// asuend
export const asuendSkill = new Skill({
    id: 1006,
    level: 1,
    key: 'thief/asuend',
    methods: {
        caster: [],
        target: []
    }
})

// clone
export const cloneSkill = new Skill({
    id: 1007,
    level: 1,
    key: 'thief/clone',
    methods: {
        caster: [],
        target: []
    }
})

// damageup-25
export const damageupMinus25Skill = new Skill({
    id: 1008,
    level: 1,
    key: 'engineer/damageup-25',
    methods: {
        caster: [],
        target: []
    }
})

// damageup-40
export const damageupMinus40Skill = new Skill({
    id: 1009,
    level: 1,
    key: 'universal/damageup-40',
    methods: {
        caster: [],
        target: []
    }
})

// damageup-5
export const damageupMinus5Skill = new Skill({
    id: 10010,
    level: 1,
    key: 'sorcerer/damageup-5',
    methods: {
        caster: [],
        target: []
    }
})

// damageup-50
export const damageupMinus50Skill = new Skill({
    id: 10011,
    level: 1,
    key: 'knight/damageup-50',
    methods: {
        caster: [],
        target: []
    }
})

// damageup-60
export const damageupMinus60Skill = new Skill({
    id: 10012,
    level: 1,
    key: 'engineer/damageup-60',
    methods: {
        caster: [],
        target: []
    }
})

// damageup100
export const damageup100Skill = new Skill({
    id: 10013,
    level: 1,
    key: 'universal/damageup100',
    methods: {
        caster: [],
        target: []
    }
})

// damageup15
export const damageup15Skill = new Skill({
    id: 10014,
    level: 1,
    key: 'sorcerer/damageup15',
    methods: {
        caster: [],
        target: []
    }
})

// damageup40
export const damageup40Skill = new Skill({
    id: 10015,
    level: 1,
    key: 'bard/damageup40',
    methods: {
        caster: [],
        target: []
    }
})

// dead-punk
export const deadPunkSkill = new Skill({
    id: 10016,
    level: 1,
    key: 'bard/dead-punk',
    methods: {
        caster: [],
        target: [
            // Skill: ["damageup-40", 1]
        ]
    }
})

// defend
export const defendSkill = new Skill({
    id: 10017,
    level: 1,
    key: 'universal/defend',
    methods: {
        caster: [],
        target: []
    }
})

// delete-energy
export const deleteEnergySkill = new Skill({
    id: 10018,
    level: 1,
    key: 'knight/delete-energy',
    methods: {
        caster: [],
        target: [
            // deleteSkill: ["energy", true]
        ]
    }
})

// energy
export const energySkill = new Skill({
    id: 10019,
    level: 1,
    key: 'sorcerer/energy',
    methods: {
        caster: [],
        target: [
            new RandomDamageMethod({ min: 50, max: 100 })
        ]
    }
})

// fima-boom
export const fimaBoomSkill = new Skill({
    id: 10020,
    level: 1,
    key: 'sorcerer/fima-boom',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(150)
        ]
    }
})

// fima-wait
export const fimaWaitSkill = new Skill({
    id: 10021,
    level: 1,
    key: 'sorcerer/fima-wait',
    methods: {
        caster: [],
        target: [
            // SkillLastStep: ["fima-wait", "fima-boom", 1]
        ]
    }
})

// fire-guitar
export const fireGuitarSkill = new Skill({
    id: 10022,
    level: 1,
    key: 'bard/fire-guitar',
    methods: {
        caster: [],
        target: []
    }
})

// fire
export const fireSkill = new Skill({
    id: 10023,
    level: 1,
    key: 'bard/fire',
    methods: {
        caster: [],
        target: [
            new RandomDamageMethod({ min: 5, max: 50 })
        ]
    }
})

// freff+
export const freffPlusSkill = new Skill({
    id: 10024,
    level: 1,
    key: 'thief/freff+',
    methods: {
        caster: [],
        target: [
            // attack: [10, 0.25]
        ]
    }
})

// freff
export const freffSkill = new Skill({
    id: 10025,
    level: 1,
    key: 'thief/freff',
    methods: {
        caster: [],
        target: [
            // attack: [1, 0.1]
        ]
    }
})

// frnd
export const frndSkill = new Skill({
    id: 10026,
    level: 1,
    key: 'thief/frnd',
    methods: {
        caster: [],
        target: [
            // SkillLastStep: ["frnd", "frnd", 3]
            // heal: [25]
        ]
    }
})

// good-punk
export const goodPunkSkill = new Skill({
    id: 10027,
    level: 1,
    key: 'bard/good-punk',
    methods: {
        caster: [],
        target: [
            // Skill: ["damageup40", 1]
            // SkillLastStep: ["good-punk", "dead-punk", 5]
        ]
    }
})

// hashon
export const hashonSkill = new Skill({
    id: 10028,
    level: 1,
    key: 'thief/hashon',
    methods: {
        caster: [],
        target: []
    }
})

// heal50
export const heal50Skill = new Skill({
    id: 10029,
    level: 1,
    key: 'engineer/heal50',
    methods: {
        caster: [],
        target: [
            // heal: [50]
        ]
    }
})

// invulnerable
export const invulnerableSkill = new Skill({
    id: 10030,
    level: 1,
    key: 'universal/invulnerable',
    methods: {
        caster: [],
        target: []
    }
})

// keyshld
export const keyShldSkill = new Skill({
    id: 10031,
    level: 1,
    key: 'sorcerer/keyshld',
    methods: {
        caster: [],
        target: [
            // Skill: ["invulnerable", 1]
        ]
    }
})

// king1
export const king1Skill = new Skill({
    id: 10032,
    level: 1,
    key: 'bard/king1',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(100),
            // SkillLastStep: ["king1", "king2", 3]
        ]
    }
})

// king2
export const king2Skill = new Skill({
    id: 10033,
    level: 1,
    key: 'bard/king2',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(50)
        ]
    }
})

// love-heal
export const loveHealSkill = new Skill({
    id: 10034,
    level: 1,
    key: 'engineer/love-heal',
    methods: {
        caster: [],
        target: [
            // noHpHeal: [25]
        ]
    }
})

// ls1
export const ls1Skill = new Skill({
    id: 10035,
    level: 5,
    key: 'bard/ls1',
    methods: {
        caster: [],
        target: [
            // Skill: ["ls2", 1]
            new SimpleDamageMethod(2)
        ]
    }
})

// ls2
export const ls2Skill = new Skill({
    id: 10036,
    level: 5,
    key: 'bard/ls2',
    methods: {
        caster: [],
        target: [
            // Skill: ["ls3", 1]
            new SimpleDamageMethod(4)
        ]
    }
})

// ls3
export const ls3Skill = new Skill({
    id: 10037,
    level: 5,
    key: 'bard/ls3',
    methods: {
        caster: [],
        target: [
            // Skill: ["ls4", 1]
            new SimpleDamageMethod(8)
        ]
    }
})

// ls4
export const ls4Skill = new Skill({
    id: 10038,
    level: 5,
    key: 'bard/ls4',
    methods: {
        caster: [],
        target: [
            // Skill: ["ls5", 1]
            new SimpleDamageMethod(16)
        ]
    }
})

// ls5
export const ls5Skill = new Skill({
    id: 10039,
    level: 5,
    key: 'bard/ls5',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(32)
        ]
    }
})

// mana50
export const mana50Skill = new Skill({
    id: 10040,
    level: 1,
    key: 'sorcerer/mana50',
    methods: {
        caster: [],
        target: [
            // mana: [50]
        ]
    }
})

// meatfall
export const meatfallSkill = new Skill({
    id: 10041,
    level: 1,
    key: 'sorcerer/meatfall',
    methods: {
        caster: [],
        target: [
            new RandomDamageMethod({ min: 30, max: 50 })
        ]
    }
})

// morgart-heal
export const morgartHealSkill = new Skill({
    id: 10042,
    level: 1,
    key: 'engineer/morgart-heal',
    methods: {
        caster: [],
        target: [
            // noHpHeal: [100]
        ]
    }
})

// no-Skills
export const noSkillsSkill = new Skill({
    id: 10043,
    level: 1,
    key: 'knight/no-Skills',
    methods: {
        caster: [],
        target: [
            // deleteSkills: [false]
        ]
    }
})

// omlet
export const omletSkill = new Skill({
    id: 10044,
    level: 1,
    key: 'thief/omlet',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(10)
        ]
    }
})

// poison-10
export const poison10Skill = new Skill({
    id: 10045,
    level: 15,
    key: 'bard/poison-10',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(10)
        ]
    }
})

// poison-bullet
export const poisonBulletSkill = new Skill({
    id: 10046,
    level: 1,
    key: 'knight/poison-bullet',
    methods: {
        caster: [],
        target: []
    }
})

// poison
export const poisonSkill = new Skill({
    id: 10047,
    level: 1,
    key: 'knight/poison',
    methods: {
        caster: [],
        target: [
            new RandomDamageMethod({ min: 20, max: 60 })
        ]
    }
})

// psn10
export const psn10Skill = new Skill({
    id: 10048,
    level: 1,
    key: 'sorcerer/psn10',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(10)
        ]
    }
})

// psn35
export const psn35Skill = new Skill({
    id: 10049,
    level: 1,
    key: 'engineer/psn35',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(35)
        ]
    }
})

// rain-cont
export const rainContSkill = new Skill({
    id: 10050,
    level: 1,
    key: 'sorcerer/rain-cont',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(15)
        ]
    }
})

// return-damage
export const returnDamageSkill = new Skill({
    id: 10051,
    level: 1,
    key: 'engineer/return-damage',
    methods: {
        caster: [],
        target: [
            // returnDamage: [30]
        ]
    }
})

// reverse-skill
export const reverseSkillSkill = new Skill({
    id: 10052,
    level: 1,
    key: 'universal/reverse-skill',
    methods: {
        caster: [],
        target: []
    }
})

// robot
export const robotSkill = new Skill({
    id: 10053,
    level: 1,
    key: 'engineer/robot',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(60)
        ]
    }
})

// self-attack
export const selfAttackSkill = new Skill({
    id: 10054,
    level: 1,
    key: 'knight/self-attack',
    methods: {
        caster: [],
        target: [
            // returnDamage: [100]
        ]
    }
})

// shower-cont
export const showerContSkill = new Skill({
    id: 10055,
    level: 1,
    key: 'sorcerer/shower-cont',
    methods: {
        caster: [
            // mana: [15]
        ],
        target: [
            // mana: [-15]
        ]
    }
})

// skip-damage
export const skipDamageSkill = new Skill({
    id: 10056,
    level: 1,
    key: 'engineer/skip-damage',
    methods: {
        caster: [],
        target: []
    }
})

// skip-skill
export const skipSkillSkill = new Skill({
    id: 10057,
    level: 1,
    key: 'universal/skip-skill',
    methods: {
        caster: [],
        target: []
    }
})

// skip-step
export const skipStepSkill = new Skill({
    id: 10058,
    level: 1,
    key: 'universal/skip-step',
    methods: {
        caster: [],
        target: [
            // skipStep: []
        ]
    }
})

// stfu-energy
export const stfuEnergySkill = new Skill({
    id: 10059,
    level: 1,
    key: 'knight/stfu-energy',
    methods: {
        caster: [],
        target: [
            // SkillHasSkill: ["energy", "delete-energy", 2]
        ]
    }
})

// sword-Skill
export const swordSkillSkill = new Skill({
    id: 10060,
    level: 1,
    key: 'engineer/sword-Skill',
    methods: {
        caster: [],
        target: [
            new RandomDamageMethod({ min: 5, max: 15 })
        ]
    }
})

// thndr-eff
export const thndrEffSkill = new Skill({
    id: 10061,
    level: 1,
    key: 'sorcerer/thndr-eff',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(50),
            // mana: [-50]
        ]
    }
})

// tower-continue
export const towerContinueSkill = new Skill({
    id: 10062,
    level: 1,
    key: 'engineer/tower-continue',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(30)
        ]
    }
})

// used-mana-up
export const usedManaUpSkill = new Skill({
    id: 10063,
    level: 1,
    key: 'bard/used-mana-up',
    methods: {
        caster: [],
        target: []
    }
})

// zero-skill
export const zeroSkillSkill = new Skill({
    id: 10064,
    level: 1,
    key: 'universal/zero-skill',
    methods: {
        caster: [],
        target: []
    }
})

export const effects: Skill[] = [
    twoHeffSkill,
    twoPercentHealSkill,
    agonySkill,
    armorUsedSkill,
    asucontSkill,
    asuendSkill,
    cloneSkill,
    damageupMinus25Skill,
    damageupMinus40Skill,
    damageupMinus5Skill,
    damageupMinus50Skill,
    damageupMinus60Skill,
    damageup100Skill,
    damageup15Skill,
    damageup40Skill,
    deadPunkSkill,
    defendSkill,
    deleteEnergySkill,
    energySkill,
    fimaBoomSkill,
    fimaWaitSkill,
    fireGuitarSkill,
    fireSkill,
    freffPlusSkill,
    freffSkill,
    frndSkill,
    goodPunkSkill,
    hashonSkill,
    heal50Skill,
    invulnerableSkill,
    keyShldSkill,
    king1Skill,
    king2Skill,
    loveHealSkill,
    ls1Skill,
    ls2Skill,
    ls3Skill,
    ls4Skill,
    ls5Skill,
    mana50Skill,
    meatfallSkill,
    morgartHealSkill,
    noSkillsSkill,
    omletSkill,
    poison10Skill,
    poisonBulletSkill,
    poisonSkill,
    psn10Skill,
    psn35Skill,
    rainContSkill,
    returnDamageSkill,
    reverseSkillSkill,
    robotSkill,
    selfAttackSkill,
    showerContSkill,
    skipDamageSkill,
    skipSkillSkill,
    skipStepSkill,
    stfuEnergySkill,
    swordSkillSkill,
    thndrEffSkill,
    towerContinueSkill,
    usedManaUpSkill,
    zeroSkillSkill,
]