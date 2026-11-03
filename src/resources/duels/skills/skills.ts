import Skill from "../../../utils/duel/skill/Skill"
import SimpleDamageMethod from "../../../utils/duel/methods/damage/SimpleDamageMethod"
import RandomDamageMethod from "../../../utils/duel/methods/damage/RandomDamageMethod"
import SimpleHealMethod from "../../../utils/duel/methods/heal/SimpleHealMethod"
import DamageLevelMethod from "../../../utils/duel/methods/damage/DamageLevelMethod"
import LostHealthDamageMethod from "../../../utils/duel/methods/damage/LostHealthDamageMethod"
import InstantKillDamageMethod from "../../../utils/duel/methods/damage/InstantKillDamageMethod"
import PercentHealMethod from "../../../utils/duel/methods/heal/PercentHealMethod"
import PercentDamageMethod from "../../../utils/duel/methods/damage/PercentDamageMethod"
import SimpleMoneyMethod from "../../../utils/duel/methods/money/SimpleMoneyMethod"
import MoneyLevelMethod from "../../../utils/duel/methods/money/MoneyLevelMethod"
import SimpleManaMethod from "../../../utils/duel/methods/mana/SimpleManaMethod"
import PercentManaMethod from "../../../utils/duel/methods/mana/PercentManaMethod"

// 2hand
export const twoHandSkill = new Skill({
    id: 1,
    level: 65,
    key: 'thief/2hand',
    methods: {
        caster: [
            new SimpleManaMethod(-400),
        ],
        target: [
            // effect: ["2heff", 5]
        ]
    }
})

// angle
export const angleSkill = new Skill({
    id: 2,
    level: 95,
    key: 'bard/angle',
    methods: {
        caster: [
            new SimpleHealMethod(200),
            new SimpleManaMethod(-500),
        ],
        target: [
            new SimpleDamageMethod(350)
        ]
    }
})

// angry-pick
export const angryPickSkill = new Skill({
    id: 3,
    level: 55,
    key: 'bard/angry-pick',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
        ],
        target: [
            new RandomDamageMethod({ min: 50, max: 250 })
        ]
    }
})

// artifact
export const artifactSkill = new Skill({
    id: 4,
    level: 55,
    key: 'engineer/artifact',
    methods: {
        caster: [
            new SimpleManaMethod(-150),
        ],
        target: [
            // effect: ["psn35", 6]
        ]
    }
})

// ash
export const ashSkill = new Skill({
    id: 5,
    level: 10,
    key: 'sorcerer/ash',
    methods: {
        caster: [
            new SimpleManaMethod(-140),
        ],
        target: [
            new SimpleDamageMethod(50),
            new SimpleManaMethod(-60),
        ]
    }
})

// asura
export const asuraSkill = new Skill({
    id: 6,
    level: 95,
    key: 'thief/asura',
    methods: {
        caster: [
            new SimpleManaMethod(-325),
        ],
        target: [
            // effectHasntEffect: ["asuend", "asucont", 1]
            // effectHasntEffect: ["asuend", "asuend", 10]
        ]
    }
})

// atheist
export const atheistSkill = new Skill({
    id: 7,
    level: 80,
    key: 'engineer/atheist',
    methods: {
        caster: [
            new SimpleManaMethod(-850),
        ],
        target: [
            new SimpleDamageMethod(200),
            // effect: ["psn35", 5]
            new PercentManaMethod(-0.45)
        ]
    }
})

// attack-bard
export const attackBardSkill = new Skill({
    id: 8,
    level: 1,
    key: 'bard/attack-bard',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({ start: 8, up: 0.4 })
        ]
    }
})

// attack-boss
export const attackBossSkill = new Skill({
    id: 9,
    level: 1,
    key: 'boss/attack-boss',
    methods: {
        caster: [],
        target: [
            new SimpleDamageMethod(110)
        ]
    }
})

// attack-bot
export const attackBotSkill = new Skill({
    id: 10,
    level: 1000,
    key: 'bot/attack-bot',
    methods: {
        caster: [],
        target: []
    }
})

// attack-engineer
export const attackEngineerSkill = new Skill({
    id: 11,
    level: 1,
    key: 'engineer/attack-engineer',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({ start: 5, up: 0.35 })
        ]
    }
})

// attack-knight
export const attackKnightSkill = new Skill({
    id: 12,
    level: 1,
    key: 'knight/attack-knight',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({ start: 15, up: 0.75 })
            // effectHasEffect: ["poison-bullet", "poison", 2]
        ]
    }
})

// attack-sorcerer
export const attackSorcererSkill = new Skill({
    id: 13,
    level: 1,
    key: 'sorcerer/attack-sorcerer',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({ start: 4, up: 0.3 })
        ]
    }
})

// attack-thief
export const attackThiefSkill = new Skill({
    id: 14,
    level: 1,
    key: 'thief/attack-thief',
    methods: {
        caster: [],
        target: [
            new DamageLevelMethod({ start: 10, up: 0.45 })
        ]
    }
})

// attack-unknown
export const attackUnknownSkill = new Skill({
    id: 15,
    level: 1000,
    key: 'unknown/attack-unknown',
    methods: {
        caster: [
            new SimpleManaMethod(1_000_000),
            new SimpleHealMethod(1_000_000),
        ],
        target: [
            new SimpleDamageMethod(1_000_000)
        ]
    }
})

// black
export const blackSkill = new Skill({
    id: 16,
    level: 55,
    key: 'thief/black',
    methods: {
        caster: [
            new SimpleManaMethod(-200),
        ],
        target: [
            // effect: ["reverse-skill", 1]
        ]
    }
})

// break
export const breakSkill = new Skill({
    id: 17,
    level: 60,
    key: 'knight/break',
    methods: {
        caster: [
            new SimpleHealMethod(100),
            new SimpleManaMethod(100),
        ],
        target: []
    }
})

// chain-trap
export const chainTrapSkill = new Skill({
    id: 18,
    level: 70,
    key: 'engineer/chain-trap',
    methods: {
        caster: [
            new SimpleManaMethod(-235),
        ],
        target: [
            // effect: ["skip-step", 3]
        ]
    }
})

// chaos
export const chaosSkill = new Skill({
    id: 19,
    level: 85,
    key: 'sorcerer/chaos',
    methods: {
        caster: [
            new SimpleManaMethod(-300),
        ],
        target: [
            new RandomDamageMethod({ min: 66, max: 666 })
        ]
    }
})

// chili-riff
export const chiliRiffSkill = new Skill({
    id: 20,
    level: 50,
    key: 'bard/chili-riff',
    methods: {
        caster: [
            new SimpleManaMethod(-200),
        ],
        target: [
            // effect: ["fire", 7]
        ]
    }
})

// chill
export const chillSkill = new Skill({
    id: 21,
    level: 95,
    key: 'sorcerer/chill',
    methods: {
        caster: [
            // effect: ["mana50", 10]
        ],
        target: []
    }
})

// circle
export const circleSkill = new Skill({
    id: 22,
    level: 35,
    key: 'sorcerer/circle',
    methods: {
        caster: [
            new SimpleManaMethod(-175),
        ],
        target: [
            // effect: ["energy", 4]
        ]
    }
})

// clfr
export const clfrSkill = new Skill({
    id: 23,
    level: 90,
    key: 'thief/clfr',
    methods: {
        caster: [
            new SimpleManaMethod(-575),
        ],
        target: [
            new DamageLevelMethod({ start: 45, up: 3 }),
            // effect: ["freff", 10]
        ]
    }
})

// cool-armor
export const coolArmorSkill = new Skill({
    id: 24,
    level: 60,
    key: 'engineer/cool-armor',
    methods: {
        caster: [
            new SimpleManaMethod(-350),
            // effectHasntEffect: ["armor-used", "defend", 350]
            // effectHasntEffect: ["armor-used", "armor-used", 999]
        ],
        target: []
    }
})

// creep
export const creepSkill = new Skill({
    id: 25,
    level: 30,
    key: 'sorcerer/creep',
    methods: {
        caster: [
            new SimpleManaMethod(-340),
        ],
        target: [
            // effect: ["zero-skill", 3]
        ]
    }
})

// crook
export const crookSkill = new Skill({
    id: 26,
    level: 30,
    key: 'thief/crook',
    methods: {
        caster: [
            new SimpleManaMethod(-150),
        ],
        target: [
            new SimpleDamageMethod(120)
        ]
    }
})

// cross
export const crossSkill = new Skill({
    id: 27,
    level: 75,
    key: 'knight/cross',
    methods: {
        caster: [
            new SimpleManaMethod(-300),
            // effect: ["invulnerable", 2]
        ],
        target: [
            // effect: ["skip-skill", 3]
        ]
    }
})

// crpt
export const crptSkill = new Skill({
    id: 28,
    level: 80,
    key: 'sorcerer/crpt',
    methods: {
        caster: [
            new SimpleManaMethod(-680),
        ],
        target: [
            // effect: ["zero-skill", 7]
        ]
    }
})

// dblfght
export const dblFghtSkill = new Skill({
    id: 29,
    level: 60,
    key: 'sorcerer/dblfght',
    methods: {
        caster: [
            new SimpleManaMethod(-840),
            // effect: ["damageup100", 7]
        ],
        target: [
            // effect: ["damageup100", 7]
        ]
    }
})

// drill
export const drillSkill = new Skill({
    id: 30,
    level: 30,
    key: 'engineer/drill',
    methods: {
        caster: [
            new SimpleManaMethod(-75),
        ],
        target: [
            new LostHealthDamageMethod(75)
        ]
    }
})

// drone
export const droneSkill = new Skill({
    id: 31,
    level: 15,
    key: 'engineer/drone',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
        ],
        target: [
            new SimpleManaMethod(-15),
            // skipStep: []
        ]
    }
})

// electro
export const electroSkill = new Skill({
    id: 32,
    level: 40,
    key: 'engineer/electro',
    methods: {
        caster: [
            new SimpleManaMethod(-250),
        ],
        target: [
            // skipStep: []
            new SimpleDamageMethod(150)
        ]
    }
})

// end
export const endSkill = new Skill({
    id: 33,
    level: 99,
    key: 'sorcerer/end',
    methods: {
        caster: [
            new SimpleManaMethod(-1250),
        ],
        target: [
            new RandomDamageMethod({ min: 1, max: 1500 })
        ]
    }
})

// envell
export const envellSkill = new Skill({
    id: 34,
    level: 20,
    key: 'knight/envell',
    methods: {
        caster: [
            new SimpleManaMethod(-85),
        ],
        target: [
            // effect: ["invulnerable", 1]
        ]
    }
})

// feedback
export const feedbackSkill = new Skill({
    id: 35,
    level: 50,
    key: 'engineer/feedback',
    methods: {
        caster: [
            new SimpleManaMethod(-225),
        ],
        target: [
            // effect: ["return-damage", 1]
            // effect: ["damageup-60", 1]
        ]
    }
})

// ffwf
export const ffwfSkill = new Skill({
    id: 36,
    level: 35,
    key: 'thief/ffwf',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
        ],
        target: [
            new SimpleDamageMethod(90),
            // effect: ["omlet", 5]
        ]
    }
})

// fima+
export const fimaPlusSkill = new Skill({
    id: 37,
    level: 20,
    key: 'sorcerer/fima+',
    methods: {
        caster: [
            new SimpleManaMethod(-75),
        ],
        target: [
            // effect: ["fima-wait", 3]
        ]
    }
})

// fima
export const fimaSkill = new Skill({
    id: 38,
    level: 5,
    key: 'sorcerer/fima',
    methods: {
        caster: [
            new SimpleManaMethod(-65),
        ],
        target: [
            // effect: ["zero-skill", 1]
            new SimpleDamageMethod(40)
        ]
    }
})

// finish
export const finishSkill = new Skill({
    id: 39,
    level: 99,
    key: 'knight/finish',
    methods: {
        caster: [
            new SimpleManaMethod(-635),
        ],
        target: [
            new InstantKillDamageMethod(0.3)
        ]
    }
})

// flutter
export const flutterSkill = new Skill({
    id: 40,
    level: 75,
    key: 'engineer/flutter',
    methods: {
        caster: [
            new SimpleManaMethod(-150),
        ],
        target: [
            new DamageLevelMethod({ start: 38, up: 1.5 }),
        ]
    }
})

// fork
export const forkSkill = new Skill({
    id: 41,
    level: 15,
    key: 'thief/fork',
    methods: {
        caster: [
            new SimpleManaMethod(-50),
        ],
        target: [
            // effect: ["clone", 10]
        ]
    }
})

// frarr
export const frarrSkill = new Skill({
    id: 42,
    level: 1,
    key: 'thief/frarr',
    methods: {
        caster: [
            new SimpleManaMethod(-30),
        ],
        target: [
            new DamageLevelMethod({ start: 15, up: 0.5 }),
            new SimpleDamageMethod(15),
            // effect: ["freff", 2]
        ]
    }
})

// friend
export const friendSkill = new Skill({
    id: 43,
    level: 70,
    key: 'thief/friend',
    methods: {
        caster: [
            new SimpleManaMethod(-700),
            // effect: ["frnd", 3]
        ],
        target: []
    }
})

// glove
export const gloveSkill = new Skill({
    id: 44,
    level: 55,
    key: 'knight/glove',
    methods: {
        caster: [
            new SimpleManaMethod(-200),
        ],
        target: [
            // effect: ["reverse-skill", 1]
        ]
    }
})

// go-go
export const goGoSkill = new Skill({
    id: 45,
    level: 15,
    key: 'knight/go-go',
    methods: {
        caster: [
            new SimpleManaMethod(-50),
        ],
        target: [
            // effect: ["skip-step", 1]
            // skipStep: []
        ]
    }
})

// godheal
export const godHealSkill = new Skill({
    id: 46,
    level: 90,
    key: 'sorcerer/godheal',
    methods: {
        caster: [
            new PercentHealMethod(1),
            new SimpleManaMethod(-1400),
            // deleteEffects: [false]
        ],
        target: []
    }
})

// grenade
export const grenadeSkill = new Skill({
    id: 47,
    level: 45,
    key: 'knight/grenade',
    methods: {
        caster: [
            new SimpleManaMethod(-200),
        ],
        target: [
            new RandomDamageMethod({ min: 150, max: 250 }),
            // effect: ["skip-step", 1]
        ]
    }
})

// gta
export const gtaSkill = new Skill({
    id: 48,
    level: 99,
    key: 'thief/gta',
    methods: {
        caster: [
            new SimpleManaMethod(-950),
        ],
        target: [
            new PercentDamageMethod(0.5),
            new SimpleMoneyMethod(1000),
        ]
    }
})

// guitar-hero
export const guitarHeroSkill = new Skill({
    id: 49,
    level: 75,
    key: 'bard/guitar-hero',
    methods: {
        caster: [
            new SimpleManaMethod(-650),
        ],
        target: [
            // effect: ["skip-step", 2]
            new SimpleManaMethod(-150),
        ]
    }
})

// gun
export const gunSkill = new Skill({
    id: 50,
    level: 10,
    key: 'knight/gun',
    methods: {
        caster: [
            new SimpleManaMethod(-10),
        ],
        target: [
            new DamageLevelMethod({ start: 25, up: 1.1 }),
        ]
    }
})

// hard-rock
export const hardRockSkill = new Skill({
    id: 51,
    level: 85,
    key: 'bard/hard-rock',
    methods: {
        caster: [
            new SimpleManaMethod(-150),
        ],
        target: [
            new RandomDamageMethod({ min: 0, max: 584 })
        ]
    }
})

// hero-song
export const heroSongSkill = new Skill({
    id: 52,
    level: 65,
    key: 'bard/hero-song',
    methods: {
        caster: [
            new PercentHealMethod(0.5),
            new PercentManaMethod(-0.5),
        ],
        target: []
    }
})

// hide
export const hideSkill = new Skill({
    id: 53,
    level: 75,
    key: 'thief/hide',
    methods: {
        caster: [
            new SimpleManaMethod(-480),
            // effect: ["damageup100", 2]
        ],
        target: []
    }
})

// honey
export const honeySkill = new Skill({
    id: 54,
    level: 45,
    key: 'thief/honey',
    methods: {
        caster: [
            // manaHasntEffect: ["hashon", 500]
            // effectHasntEffect: ["hashon", "hashon", 20]
        ],
        target: []
    }
})

// hrdarr
export const hrdArrSkill = new Skill({
    id: 55,
    level: 20,
    key: 'thief/hrdarr',
    methods: {
        caster: [
            new SimpleManaMethod(-50),
        ],
        target: [
            new DamageLevelMethod({ start: 30, up: 2 }),
        ]
    }
})

// ice
export const iceSkill = new Skill({
    id: 56,
    level: 1,
    key: 'sorcerer/ice',
    methods: {
        caster: [
            new SimpleManaMethod(-30),
        ],
        target: [
            new SimpleDamageMethod(20),
            // effect: ["damageup-5", 1]
        ]
    }
})

// invis
export const invisSkill = new Skill({
    id: 57,
    level: 10,
    key: 'thief/invis',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
            // effect: ["invulnerable", 1]
        ],
        target: []
    }
})

// iron-man
export const ironManSkill = new Skill({
    id: 58,
    level: 95,
    key: 'engineer/iron-man',
    methods: {
        caster: [
            // effect: ["damageup100", 6]
        ],
        target: [
            // effect: ["damageup-25", 6]
        ]
    }
})

// iron
export const ironSkill = new Skill({
    id: 59,
    level: 50,
    key: 'knight/iron',
    methods: {
        caster: [
            new SimpleManaMethod(-200),
            // effect: ["no-effects", 2]
            // deleteEffects: [false]
        ],
        target: [
            // effect: ["damageup-50", 2]
        ]
    }
})

// jimmy
export const jimmySkill = new Skill({
    id: 60,
    level: 25,
    key: 'bard/jimmy',
    methods: {
        caster: [
            // manaHasntEffect: [-50, "fire-guitar"]
            // effectHasntEffect: ["fire-guitar", "fire-guitar", 4]
        ],
        target: [
            new DamageLevelMethod({ start: 8, up: 1.6 }),
        ]
    }
})

// key
export const keySkill = new Skill({
    id: 61,
    level: 50,
    key: 'thief/key',
    methods: {
        caster: [
            new SimpleManaMethod(-1),
        ],
        target: [
            // deleteEffect: ["keyshld", false]
        ]
    }
})

// key85
export const key85Skill = new Skill({
    id: 62,
    level: 85,
    key: 'thief/key85',
    methods: {
        caster: [
            new SimpleManaMethod(-590),
        ],
        target: [
            // effect: ["zero-skill", 6]
        ]
    }
})

// king-song
export const kingSongSkill = new Skill({
    id: 63,
    level: 80,
    key: 'bard/king-song',
    methods: {
        caster: [
            new SimpleManaMethod(-175),
        ],
        target: [
            // effect: ["king1", 2]
        ]
    }
})

// koffy
export const koffySkill = new Skill({
    id: 64,
    level: 45,
    key: 'bard/koffy',
    methods: {
        caster: [
            new SimpleManaMethod(-250),
            new SimpleHealMethod(100),
            // effect: ["invulnerable", 1]
        ],
        target: []
    }
})

// ktaro-hi
export const ktaroHiSkill = new Skill({
    id: 65,
    level: 100,
    key: 'sorcerer/ktaro-hi',
    methods: {
        caster: [],
        target: [
            // effect: ["psn10", 999]
        ]
    }
})

// kys
export const kysSkill = new Skill({
    id: 66,
    level: 25,
    key: 'knight/kys',
    methods: {
        caster: [
            new SimpleManaMethod(-50),
        ],
        target: [
            // effect: ["self-attack", 1]
        ]
    }
})

// lamp
export const lampSkill = new Skill({
    id: 67,
    level: 40,
    key: 'bard/lamp',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
            // effect: ["invulnerable", 1]
        ],
        target: []
    }
})

// laugh-sin
export const laughSinSkill = new Skill({
    id: 68,
    level: 5,
    key: 'bard/laugh-sin',
    methods: {
        caster: [
            new SimpleManaMethod(-45),
        ],
        target: [
            // effect: ["ls1", 1]
        ]
    }
})

// lockshld
export const lockShldSkill = new Skill({
    id: 69,
    level: 50,
    key: 'sorcerer/lockshld',
    methods: {
        caster: [
            new SimpleManaMethod(-550),
            // effect: ["keyshld", 4]
        ],
        target: []
    }
})

// love
export const loveSkill = new Skill({
    id: 70,
    level: 90,
    key: 'engineer/love',
    methods: {
        caster: [
            new SimpleManaMethod(-450),
            // effect: ["love-heal", 1]
        ],
        target: []
    }
})

// lshield
export const lShieldSkill = new Skill({
    id: 71,
    level: 90,
    key: 'knight/lshield',
    methods: {
        caster: [
            new SimpleManaMethod(-350),
            // effect: ["invulnerable", 3]
        ],
        target: []
    }
})

// lstlgt
export const lstLgtSkill = new Skill({
    id: 72,
    level: 65,
    key: 'sorcerer/lstlgt',
    methods: {
        caster: [
            new SimpleManaMethod(-925),
        ],
        target: [
            new SimpleDamageMethod(12),
            // effect: ["skip-step", 3]
        ]
    }
})

// lstore
export const lStoreSkill = new Skill({
    id: 73,
    level: 45,
    key: 'sorcerer/lstore',
    methods: {
        caster: [
            new SimpleManaMethod(-450),
            new SimpleHealMethod(200),
            // effect: ["damageup15", 3]
        ],
        target: []
    }
})

// maad
export const maadSkill = new Skill({
    id: 74,
    level: 40,
    key: 'knight/maad',
    methods: {
        caster: [
            new SimpleManaMethod(-150),
        ],
        target: [
            // effect: ["damageup-50", 5]
        ]
    }
})

// mana-up
export const manaUpSkill = new Skill({
    id: 75,
    level: 60,
    key: 'bard/mana-up',
    methods: {
        caster: [
            // manaHasntEffect: [535, "used-mana-up"]
            // effect: ["used-mana-up", 30]
        ],
        target: []
    }
})

// master-of-field
export const masterOfFieldSkill = new Skill({
    id: 76,
    level: 65,
    key: 'engineer/master-of-field',
    methods: {
        caster: [
            new SimpleManaMethod(-160),
        ],
        target: [
            // effect: ["damageup-40", 6]
        ]
    }
})

// maxim
export const maximSkill = new Skill({
    id: 77,
    level: 40,
    key: 'thief/maxim',
    methods: {
        caster: [
            new SimpleManaMethod(-150),
        ],
        target: [
            new RandomDamageMethod({ min: 0, max: 300 })
        ]
    }
})

// morgart
export const morgartSkill = new Skill({
    id: 78,
    level: 99,
    key: 'engineer/morgart',
    methods: {
        caster: [
            new SimpleManaMethod(-900),
            // effect: ["morgart-heal", 3]
        ],
        target: []
    }
})

// noskill
export const noSkillSkill = new Skill({
    id: 79,
    level: 60,
    key: 'thief/noskill',
    methods: {
        caster: [
            new SimpleManaMethod(-500),
        ],
        target: [
            // removeSkill: [0]
        ]
    }
})

// on-sky
export const onSkySkill = new Skill({
    id: 80,
    level: 25,
    key: 'engineer/on-sky',
    methods: {
        caster: [
            new SimpleManaMethod(-340),
        ],
        target: [
            // effect: ["skip-step", 3]
        ]
    }
})

// one-tower
export const oneTowerSkill = new Skill({
    id: 81,
    level: 5,
    key: 'engineer/one-tower',
    methods: {
        caster: [
            new SimpleManaMethod(-14),
        ],
        target: [
            new SimpleDamageMethod(28)
        ]
    }
})

// orbit
export const orbitSkill = new Skill({
    id: 82,
    level: 25,
    key: 'thief/orbit',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
        ],
        target: [
            // effect: ["skip-step", 1]
            // skipStep: []
        ]
    }
})

// phantom
export const phantomSkill = new Skill({
    id: 83,
    level: 20,
    key: 'engineer/phantom',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
            // effect: ["skip-damage", 5]
        ],
        target: []
    }
})

// phenix
export const phenixSkill = new Skill({
    id: 84,
    level: 70,
    key: 'knight/phenix',
    methods: {
        caster: [
            new SimpleManaMethod(-450),
            new SimpleHealMethod(200),
        ],
        target: [
            new SimpleDamageMethod(100),
            new SimpleManaMethod(-200),
        ]
    }
})

// piglins
export const piglinsSkill = new Skill({
    id: 85,
    level: 65,
    key: 'knight/piglins',
    methods: {
        caster: [
            new SimpleManaMethod(-350),
        ],
        target: [
            // effect: ["damageup-50", 8]
        ]
    }
})

// punk-rock
export const punkRockSkill = new Skill({
    id: 86,
    level: 70,
    key: 'bard/punk-rock',
    methods: {
        caster: [
            new SimpleManaMethod(-300),
            // effect: ["good-punk", 3]
        ],
        target: []
    }
})

// qsr
export const qsrSkill = new Skill({
    id: 87,
    level: 70,
    key: 'sorcerer/qsr',
    methods: {
        caster: [
            // effect: ["skip-step", 2]
            new SimpleManaMethod(-200),
        ],
        target: [
            new PercentDamageMethod(0.3)
        ]
    }
})

// rock-void
export const rockVoidSkill = new Skill({
    id: 88,
    level: 1,
    key: 'engineer/rock-void',
    methods: {
        caster: [
            new SimpleManaMethod(-1),
        ],
        target: [
            new SimpleDamageMethod(8)
        ]
    }
})

// scary-notes
export const scaryNotesSkill = new Skill({
    id: 89,
    level: 15,
    key: 'bard/scary-notes',
    methods: {
        caster: [
            new SimpleManaMethod(-50),
        ],
        target: [
            new SimpleDamageMethod(40),
            // effect: ["poison-10", 4]
        ]
    }
})

// shield+
export const shieldPlusSkill = new Skill({
    id: 90,
    level: 80,
    key: 'knight/shield+',
    methods: {
        caster: [
            new SimpleManaMethod(-50),
            // effectLevel: ["defend", 5, 1.75]
        ],
        target: []
    }
})

// shield
export const shieldSkill = new Skill({
    id: 91,
    level: 1,
    key: 'knight/shield',
    methods: {
        caster: [
            new SimpleManaMethod(-10),
            // effectLevel: ["defend", 3, 1]
        ],
        target: []
    }
})

// shower
export const showerSkill = new Skill({
    id: 92,
    level: 25,
    key: 'sorcerer/shower',
    methods: {
        caster: [
            new SimpleManaMethod(-60),
        ],
        target: [
            // effect: ["shower-cont", 4]
        ]
    }
})

// sleep-melody
export const sleepMelodySkill = new Skill({
    id: 93,
    level: 20,
    key: 'bard/sleep-melody',
    methods: {
        caster: [
            new SimpleManaMethod(60),
        ],
        target: []
    }
})

// sleep
export const sleepSkill = new Skill({
    id: 94,
    level: 35,
    key: 'engineer/sleep',
    methods: {
        caster: [
            new SimpleManaMethod(-220),
            // effect: ["heal50", 6]
        ],
        target: []
    }
})

// stay
export const staySkill = new Skill({
    id: 95,
    level: 35,
    key: 'bard/stay',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
            // effect: ["2precent-heal", 3]
        ],
        target: []
    }
})

// stfu-light
export const stfuLightSkill = new Skill({
    id: 96,
    level: 35,
    key: 'knight/stfu-light',
    methods: {
        caster: [
            new SimpleManaMethod(-75),
            // effect: ["stfu-energy", 5]
        ],
        target: []
    }
})

// string
export const stringSkill = new Skill({
    id: 97,
    level: 1,
    key: 'bard/string',
    methods: {
        caster: [
            new SimpleManaMethod(-3),
        ],
        target: [
            new SimpleDamageMethod(16)
        ]
    }
})

// subwaysurf
export const subwaysurfSkill = new Skill({
    id: 98,
    level: 5,
    key: 'knight/subwaysurf',
    methods: {
        caster: [
            new SimpleManaMethod(-5),
        ],
        target: [
            new DamageLevelMethod({ start: 25, up: 0.25 }),
        ]
    }
})

// sugar-rain
export const sugarRainSkill = new Skill({
    id: 99,
    level: 15,
    key: 'sorcerer/sugar-rain',
    methods: {
        caster: [
            new SimpleManaMethod(-65),
        ],
        target: [
            new SimpleDamageMethod(40),
            // effect: ["rain-cont", 3]
        ]
    }
})

// sun-up
export const sunUpSkill = new Skill({
    id: 100,
    level: 99,
    key: 'bard/sun-up',
    methods: {
        caster: [
            new SimpleManaMethod(-550),
        ],
        target: [
            new SimpleDamageMethod(300),
            // effect: ["agony", 7]
        ]
    }
})

// super
export const superSkill = new Skill({
    id: 101,
    level: 30,
    key: 'knight/super',
    methods: {
        caster: [
            new SimpleManaMethod(-80),
            // effect: ["poison-bullet", 5]
        ],
        target: []
    }
})

// theft
export const theftSkill = new Skill({
    id: 102,
    level: 5,
    key: 'thief/theft',
    methods: {
        caster: [
            new SimpleManaMethod(-20),
        ],
        target: [
            new MoneyLevelMethod({
                start: 6,
                up: 3
            })
        ]
    }
})

// thndr
export const thndrSkill = new Skill({
    id: 103,
    level: 55,
    key: 'sorcerer/thndr',
    methods: {
        caster: [
            new SimpleManaMethod(-675),
        ],
        target: [
            new SimpleDamageMethod(75),
            // effect: ["thndr-eff", 3]
        ]
    }
})

// tower
export const towerSkill = new Skill({
    id: 104,
    level: 45,
    key: 'engineer/tower',
    methods: {
        caster: [
            new SimpleManaMethod(-200),
        ],
        target: [
            // effect: ["skip-skill", 1]
            // effect: ["tower-continue", 2]
            new SimpleDamageMethod(45)
        ]
    }
})

// tr
export const trSkill = new Skill({
    id: 105,
    level: 80,
    key: 'thief/tr',
    methods: {
        caster: [
            new SimpleManaMethod(-1000),
        ],
        target: [
            // useSkillIndex: [0]
            // removeSkill: [0]
        ]
    }
})

// we-die
export const weDieSkill = new Skill({
    id: 106,
    level: 90,
    key: 'bard/we-die',
    methods: {
        caster: [
            new PercentManaMethod(-0.15),
        ],
        target: [
            new PercentDamageMethod(0.05),
            new PercentManaMethod(-0.1),
        ]
    }
})

// white-def
export const whiteDefSkill = new Skill({
    id: 107,
    level: 85,
    key: 'knight/white-def',
    methods: {
        caster: [
            new SimpleManaMethod(-300),
            // effect: ["damageup25", 10]
        ],
        target: []
    }
})

// white-defender
export const whiteDefenderSkill = new Skill({
    id: 108,
    level: 10,
    key: 'bard/white-defender',
    methods: {
        caster: [
            new SimpleManaMethod(-20),
            // effect: ["defend", 25]
        ],
        target: []
    }
})

// womanet
export const womanetSkill = new Skill({
    id: 109,
    level: 85,
    key: 'engineer/womanet',
    methods: {
        caster: [
            new SimpleManaMethod(-500),
        ],
        target: [
            // effect: ["robot", 10]
        ]
    }
})

// wood-sword
export const woodSwordSkill = new Skill({
    id: 110,
    level: 10,
    key: 'engineer/wood-sword',
    methods: {
        caster: [
            new SimpleManaMethod(-50),
        ],
        target: [
            // effect: ["sword-effect", 7]
        ]
    }
})

// yammy
export const yammySkill = new Skill({
    id: 111,
    level: 40,
    key: 'sorcerer/yammy',
    methods: {
        caster: [
            new SimpleManaMethod(-400),
        ],
        target: [
            // effect: ["meatfall", 10]
        ]
    }
})

// yeah-rock
export const yeahRockSkill = new Skill({
    id: 112,
    level: 30,
    key: 'bard/yeah-rock',
    methods: {
        caster: [
            new SimpleManaMethod(-100),
        ],
        target: [
            new RandomDamageMethod({ min: 75, max: 150 })
        ]
    }
})

export const skills: Skill[] = [
    twoHandSkill,
    angleSkill,
    angryPickSkill,
    artifactSkill,
    ashSkill,
    asuraSkill,
    atheistSkill,
    attackBardSkill,
    attackBossSkill,
    attackBotSkill,
    attackEngineerSkill,
    attackKnightSkill,
    attackSorcererSkill,
    attackThiefSkill,
    attackUnknownSkill,
    blackSkill,
    breakSkill,
    chainTrapSkill,
    chaosSkill,
    chiliRiffSkill,
    chillSkill,
    circleSkill,
    clfrSkill,
    coolArmorSkill,
    creepSkill,
    crookSkill,
    crossSkill,
    crptSkill,
    dblFghtSkill,
    drillSkill,
    droneSkill,
    electroSkill,
    endSkill,
    envellSkill,
    feedbackSkill,
    ffwfSkill,
    fimaPlusSkill,
    fimaSkill,
    finishSkill,
    flutterSkill,
    forkSkill,
    frarrSkill,
    friendSkill,
    gloveSkill,
    goGoSkill,
    godHealSkill,
    grenadeSkill,
    gtaSkill,
    guitarHeroSkill,
    gunSkill,
    hardRockSkill,
    heroSongSkill,
    hideSkill,
    honeySkill,
    hrdArrSkill,
    iceSkill,
    invisSkill,
    ironManSkill,
    ironSkill,
    jimmySkill,
    keySkill,
    key85Skill,
    kingSongSkill,
    koffySkill,
    ktaroHiSkill,
    kysSkill,
    lampSkill,
    laughSinSkill,
    lockShldSkill,
    loveSkill,
    lShieldSkill,
    lstLgtSkill,
    lStoreSkill,
    maadSkill,
    manaUpSkill,
    masterOfFieldSkill,
    maximSkill,
    morgartSkill,
    noSkillSkill,
    onSkySkill,
    oneTowerSkill,
    orbitSkill,
    phantomSkill,
    phenixSkill,
    piglinsSkill,
    punkRockSkill,
    qsrSkill,
    rockVoidSkill,
    scaryNotesSkill,
    shieldPlusSkill,
    shieldSkill,
    showerSkill,
    sleepMelodySkill,
    sleepSkill,
    staySkill,
    stfuLightSkill,
    stringSkill,
    subwaysurfSkill,
    sugarRainSkill,
    sunUpSkill,
    superSkill,
    theftSkill,
    thndrSkill,
    towerSkill,
    trSkill,
    weDieSkill,
    whiteDefSkill,
    whiteDefenderSkill,
    womanetSkill,
    woodSwordSkill,
    yammySkill,
    yeahRockSkill,
]