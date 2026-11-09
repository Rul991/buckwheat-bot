import NextStepMethod from "../../../utils/duel/methods/control/NextStepMethod"
import RemoveSkillMethod from "../../../utils/duel/methods/control/RemoveSkillMethod"
import UseSkillMethod from "../../../utils/duel/methods/control/UseSkillMethod"
import DamageLevelMethod from "../../../utils/duel/methods/damage/DamageLevelMethod"
import InstantKillDamageMethod from "../../../utils/duel/methods/damage/InstantKillDamageMethod"
import LostHealthDamageMethod from "../../../utils/duel/methods/damage/LostHealthDamageMethod"
import PercentDamageMethod from "../../../utils/duel/methods/damage/PercentDamageMethod"
import RandomDamageMethod from "../../../utils/duel/methods/damage/RandomDamageMethod"
import SimpleEffectAddMethod from "../../../utils/duel/methods/effect/add/SimpleEffectAddMethod"
import DeleteEffectsMethod from "../../../utils/duel/methods/effect/other/DeleteEffectsMethod"
import PercentHealMethod from "../../../utils/duel/methods/heal/PercentHealMethod"
import PercentManaMethod from "../../../utils/duel/methods/mana/PercentManaMethod"
import SimpleManaMethod from "../../../utils/duel/methods/mana/SimpleManaMethod"
import MoneyLevelMethod from "../../../utils/duel/methods/money/MoneyLevelMethod"
import ReturnDamageMethod from "../../../utils/duel/methods/reaction/ReturnDamageMethod"
import Skill from "../../../utils/duel/skill/Skill"
import { mockeryEffect, inspiringMotifEffect, hymnOfResilienceEffect, deafenedEffect, droneShieldEffect, oilSlickEffect, shockTrapEffect, turretEffect, bleedEffect, knightRallyEffect, burnEffect, emberEffect, frostbiteEffect, poisonEffect, shadowCloakEffect, smokeBombEffect, venomTrapEffect } from "./effects"

export const devSkill = new Skill({
    id: 0,
    level: 1,
    key: 'universal/dev',
    methods: {
        caster: [

        ],
        target: [

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
            new DamageLevelMethod(8, 0.4),
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
            new DamageLevelMethod(5, 0.35),
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
            new DamageLevelMethod(15, 0.75),
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
            new DamageLevelMethod(4, 0.3),
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
            new DamageLevelMethod(10, 0.45),
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
            new DamageLevelMethod(15, 0.75),
        ]
    }
})

export const stringStrikeSkill = new Skill({
    id: 8,
    level: 1,
    key: 'bard/string-strike',
    methods: {
        caster: [new SimpleManaMethod(-8)],
        target: [new DamageLevelMethod(8, 1)]
    }
})

export const mockerySkill = new Skill({
    id: 9,
    level: 5,
    key: 'bard/mockery',
    methods: {
        caster: [new SimpleManaMethod(-12)],
        target: [new SimpleEffectAddMethod(mockeryEffect, 4)]
    }
})

export const inspiringMotifSkill = new Skill({
    id: 10,
    level: 10,
    key: 'bard/inspiring-motif',
    methods: {
        caster: [new SimpleManaMethod(-25), new SimpleEffectAddMethod(inspiringMotifEffect, 3)],
        target: []
    }
})

export const thievingBalladSkill = new Skill({
    id: 11,
    level: 12,
    key: 'bard/thieving-ballad',
    methods: {
        caster: [new SimpleManaMethod(-10)],
        target: [new MoneyLevelMethod(10, 3)]
    }
})

export const lullabySkill = new Skill({
    id: 12,
    level: 18,
    key: 'bard/lullaby',
    methods: {
        caster: [new SimpleManaMethod(-50), new NextStepMethod()],
        target: []
    }
})

export const dissonanceSkill = new Skill({
    id: 13,
    level: 22,
    key: 'bard/dissonance',
    methods: {
        caster: [new SimpleManaMethod(-30)],
        target: [new DamageLevelMethod(10, 2), new PercentManaMethod(-0.08)]
    }
})

export const chordOfRetributionSkill = new Skill({
    id: 14,
    level: 25,
    key: 'bard/chord-of-retribution',
    methods: {
        caster: [new SimpleManaMethod(-20)],
        target: [new ReturnDamageMethod(0.4)]
    }
})

export const hymnOfResilienceSkill = new Skill({
    id: 15,
    level: 28,
    key: 'bard/hymn-of-resilience',
    methods: {
        caster: [new SimpleManaMethod(-40), new SimpleEffectAddMethod(hymnOfResilienceEffect, 4)],
        target: []
    }
})

export const deafeningNoteSkill = new Skill({
    id: 16,
    level: 35,
    key: 'bard/deafening-note',
    methods: {
        caster: [new SimpleManaMethod(-50)],
        target: [new DamageLevelMethod(12, 2), new SimpleEffectAddMethod(deafenedEffect, 3)]
    }
})

export const sirensLamentSkill = new Skill({
    id: 17,
    level: 40,
    key: 'bard/sirens-lament',
    methods: {
        caster: [new SimpleManaMethod(-45)],
        target: [new PercentDamageMethod(0.12)]
    }
})

export const vampiricMelodySkill = new Skill({
    id: 18,
    level: 45,
    key: 'bard/vampiric-melody',
    methods: {
        caster: [new SimpleManaMethod(-55), new PercentHealMethod(0.08)],
        target: [new DamageLevelMethod(15, 3)]
    }
})

export const skillTheftSkill = new Skill({
    id: 19,
    level: 50,
    key: 'bard/skill-theft',
    methods: {
        caster: [new SimpleManaMethod(-70)],
        target: [new RemoveSkillMethod()]
    }
})

export const requiemSkill = new Skill({
    id: 20,
    level: 55,
    key: 'bard/requiem',
    methods: {
        caster: [new SimpleManaMethod(-90)],
        target: [new UseSkillMethod()]
    }
})

export const finalChordSkill = new Skill({
    id: 21,
    level: 65,
    key: 'bard/final-chord',
    methods: {
        caster: [new SimpleManaMethod(-75)],
        target: [new LostHealthDamageMethod(180)]
    }
})

export const absoluteHarmonySkill = new Skill({
    id: 22,
    level: 80,
    key: 'bard/absolute-harmony',
    methods: {
        caster: [new SimpleManaMethod(-140)],
        target: [new InstantKillDamageMethod(0.3)]
    }
})

export const gauntletPunchSkill = new Skill({
    id: 23,
    level: 1,
    key: 'engineer/gauntlet-punch',
    methods: {
        caster: [new SimpleManaMethod(-8)],
        target: [new DamageLevelMethod(7, 1)]
    }
})

export const deployTurretSkill = new Skill({
    id: 24,
    level: 6,
    key: 'engineer/deploy-turret',
    methods: {
        caster: [new SimpleManaMethod(-15)],
        target: [new SimpleEffectAddMethod(turretEffect, 4)]
    }
})

export const repairKitSkill = new Skill({
    id: 25,
    level: 10,
    key: 'engineer/repair-kit',
    methods: {
        caster: [new SimpleManaMethod(-20), new PercentHealMethod(0.12)],
        target: []
    }
})

export const shockTrapSkill = new Skill({
    id: 26,
    level: 14,
    key: 'engineer/shock-trap',
    methods: {
        caster: [new SimpleManaMethod(-18)],
        target: [new SimpleEffectAddMethod(shockTrapEffect, 3)]
    }
})

export const reactivePlatingSkill = new Skill({
    id: 27,
    level: 18,
    key: 'engineer/reactive-plating',
    methods: {
        caster: [new SimpleManaMethod(-25)],
        target: [new ReturnDamageMethod(0.35)]
    }
})

export const oilSlickSkill = new Skill({
    id: 28,
    level: 22,
    key: 'engineer/oil-slick',
    methods: {
        caster: [new SimpleManaMethod(-20)],
        target: [new SimpleEffectAddMethod(oilSlickEffect, 4)]
    }
})

export const arcWelderSkill = new Skill({
    id: 29,
    level: 26,
    key: 'engineer/arc-welder',
    methods: {
        caster: [new SimpleManaMethod(-35)],
        target: [new DamageLevelMethod(10, 2), new PercentManaMethod(-0.06)]
    }
})

export const droneShieldSkill = new Skill({
    id: 30,
    level: 30,
    key: 'engineer/drone-shield',
    methods: {
        caster: [new SimpleManaMethod(-35), new SimpleEffectAddMethod(droneShieldEffect, 3)],
        target: []
    }
})

export const magneticPullSkill = new Skill({
    id: 31,
    level: 34,
    key: 'engineer/magnetic-pull',
    methods: {
        caster: [new SimpleManaMethod(-60), new NextStepMethod()],
        target: []
    }
})

export const scrapCannonSkill = new Skill({
    id: 32,
    level: 38,
    key: 'engineer/scrap-cannon',
    methods: {
        caster: [new SimpleManaMethod(-40)],
        target: [new DamageLevelMethod(12, 2)]
    }
})

export const emergencyVentSkill = new Skill({
    id: 33,
    level: 42,
    key: 'engineer/emergency-vent',
    methods: {
        caster: [ new SimpleManaMethod(-30), new DeleteEffectsMethod([], false) ],
        target: []
    }
})

export const scrapSalvageSkill = new Skill({
    id: 34,
    level: 46,
    key: 'engineer/scrap-salvage',
    methods: {
        caster: [new SimpleManaMethod(-20)],
        target: [new MoneyLevelMethod(20, 4)]
    }
})

export const hijackSkill = new Skill({
    id: 35,
    level: 52,
    key: 'engineer/hijack',
    methods: {
        caster: [new SimpleManaMethod(-100)],
        target: [new UseSkillMethod()]
    }
})

export const selfDestructProtocolSkill = new Skill({
    id: 36,
    level: 60,
    key: 'engineer/self-destruct-protocol',
    methods: {
        caster: [new SimpleManaMethod(-60)],
        target: [new LostHealthDamageMethod(150)]
    }
})

export const coreMeltdownSkill = new Skill({
    id: 37,
    level: 75,
    key: 'engineer/core-meltdown',
    methods: {
        caster: [new SimpleManaMethod(-150)],
        target: [new InstantKillDamageMethod(0.25)]
    }
})

export const slashSkill = new Skill({
    id: 38,
    level: 1,
    key: 'knight/slash',
    methods: {
        caster: [new PercentManaMethod(-0.05)],
        target: [new DamageLevelMethod(6, 1)]
    }
})

export const shotgunBlastSkill = new Skill({
    id: 39,
    level: 3,
    key: 'knight/shotgun-blast',
    methods: {
        caster: [new PercentManaMethod(-0.06)],
        target: [new RandomDamageMethod(10, 20)]
    }
})

export const blockStanceSkill = new Skill({
    id: 40,
    level: 6,
    key: 'knight/block-stance',
    methods: {
        caster: [new PercentManaMethod(-0.08)],
        target: [new ReturnDamageMethod(0.3)]
    }
})

export const armorPlatingSkill = new Skill({
    id: 41,
    level: 9,
    key: 'knight/armor-plating',
    methods: {
        caster: [new PercentManaMethod(-0.1), new PercentHealMethod(0.15)],
        target: []
    }
})

export const deepCutSkill = new Skill({
    id: 42,
    level: 12,
    key: 'knight/deep-cut',
    methods: {
        caster: [new PercentManaMethod(-0.07)],
        target: [new DamageLevelMethod(4, 1), new SimpleEffectAddMethod(bleedEffect, 4)]
    }
})

export const shieldBashSkill = new Skill({
    id: 43,
    level: 20,
    key: 'knight/shield-bash',
    methods: {
        caster: [new PercentManaMethod(-0.15), new NextStepMethod()],
        target: [new DamageLevelMethod(10, 2)]
    }
})

export const sunderArmorSkill = new Skill({
    id: 44,
    level: 24,
    key: 'knight/sunder-armor',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new DamageLevelMethod(8, 2), new DeleteEffectsMethod([], false)]
    }
})

export const rallyingCrySkill = new Skill({
    id: 45,
    level: 28,
    key: 'knight/rallying-cry',
    methods: {
        caster: [new PercentManaMethod(-0.12), new SimpleEffectAddMethod(knightRallyEffect, 4)],
        target: []
    }
})

export const suppressiveFireSkill = new Skill({
    id: 46,
    level: 32,
    key: 'knight/suppressive-fire',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new DamageLevelMethod(12, 2), new PercentManaMethod(-0.05)]
    }
})

export const disarmSkill = new Skill({
    id: 47,
    level: 40,
    key: 'knight/disarm',
    methods: {
        caster: [new PercentManaMethod(-0.15)],
        target: [new RemoveSkillMethod()]
    }
})

export const piercingShotSkill = new Skill({
    id: 48,
    level: 44,
    key: 'knight/piercing-shot',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new PercentDamageMethod(0.12)]
    }
})

export const lastStandSkill = new Skill({
    id: 49,
    level: 50,
    key: 'knight/last-stand',
    methods: {
        caster: [new PercentManaMethod(-0.12)],
        target: [new LostHealthDamageMethod(120)]
    }
})

export const riposteSkill = new Skill({
    id: 50,
    level: 56,
    key: 'knight/riposte',
    methods: {
        caster: [new PercentManaMethod(-0.15)],
        target: [new DamageLevelMethod(15, 2), new ReturnDamageMethod(0.3)]
    }
})

export const executionersShotSkill = new Skill({
    id: 51,
    level: 70,
    key: 'knight/executioners-shot',
    methods: {
        caster: [new PercentManaMethod(-0.2)],
        target: [new InstantKillDamageMethod(0.25)]
    }
})

export const indomitableSkill = new Skill({
    id: 52,
    level: 80,
    key: 'knight/indomitable',
    methods: {
        caster: [new PercentManaMethod(-0.15), new PercentHealMethod(0.3)],
        target: []
    }
})

export const arcaneBoltSkill = new Skill({
    id: 53,
    level: 1,
    key: 'sorcerer/arcane-bolt',
    methods: {
        caster: [new SimpleManaMethod(-8)],
        target: [new DamageLevelMethod(6, 1)]
    }
})

export const igniteSkill = new Skill({
    id: 54,
    level: 4,
    key: 'sorcerer/ignite',
    methods: {
        caster: [new SimpleManaMethod(-20)],
        target: [new SimpleEffectAddMethod(burnEffect, 3)]
    }
})

export const manaShieldSkill = new Skill({
    id: 55,
    level: 8,
    key: 'sorcerer/mana-shield',
    methods: {
        caster: [new PercentManaMethod(-0.15), new PercentHealMethod(0.15)],
        target: []
    }
})

export const iceSpikeSkill = new Skill({
    id: 56,
    level: 12,
    key: 'sorcerer/ice-spike',
    methods: {
        caster: [new PercentManaMethod(-0.08)],
        target: [new SimpleEffectAddMethod(frostbiteEffect, 3)]
    }
})

export const lightningBoltSkill = new Skill({
    id: 57,
    level: 15,
    key: 'sorcerer/lightning-bolt',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new DamageLevelMethod(8, 2), new PercentManaMethod(-0.05)]
    }
})

export const manaSpringSkill = new Skill({
    id: 58,
    level: 20,
    key: 'sorcerer/mana-spring',
    methods: {
        caster: [new PercentDamageMethod(0.1), new PercentManaMethod(0.2)],
        target: []
    }
})

export const arcaneWardSkill = new Skill({
    id: 59,
    level: 25,
    key: 'sorcerer/arcane-ward',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new ReturnDamageMethod(0.4)]
    }
})

export const dispelSkill = new Skill({
    id: 60,
    level: 30,
    key: 'sorcerer/dispel',
    methods: {
        caster: [new PercentManaMethod(-0.12)],
        target: [new DeleteEffectsMethod([], false)]
    }
})

export const meteorSkill = new Skill({
    id: 61,
    level: 35,
    key: 'sorcerer/meteor',
    methods: {
        caster: [new PercentManaMethod(-0.18)],
        target: [new DamageLevelMethod(15, 2)]
    }
})

export const timeFreezeSkill = new Skill({
    id: 62,
    level: 42,
    key: 'sorcerer/time-freeze',
    methods: {
        caster: [new PercentManaMethod(-0.25), new NextStepMethod()],
        target: []
    }
})

export const arcaneSiphonSkill = new Skill({
    id: 63,
    level: 48,
    key: 'sorcerer/arcane-siphon',
    methods: {
        caster: [new PercentManaMethod(-0.15), new PercentHealMethod(0.1)],
        target: [new PercentDamageMethod(0.15)]
    }
})

export const silenceSkill = new Skill({
    id: 64,
    level: 54,
    key: 'sorcerer/silence',
    methods: {
        caster: [new PercentManaMethod(-0.15)],
        target: [new RemoveSkillMethod()]
    }
})

export const puppetStringsSkill = new Skill({
    id: 65,
    level: 58,
    key: 'sorcerer/puppet-strings',
    methods: {
        caster: [new PercentManaMethod(-0.18)],
        target: [new UseSkillMethod()]
    }
})

export const arcaneOverloadSkill = new Skill({
    id: 66,
    level: 68,
    key: 'sorcerer/arcane-overload',
    methods: {
        caster: [new PercentManaMethod(-0.12)],
        target: [new LostHealthDamageMethod(150)]
    }
})

export const absoluteZeroSkill = new Skill({
    id: 67,
    level: 80,
    key: 'sorcerer/absolute-zero',
    methods: {
        caster: [new PercentManaMethod(-0.2)],
        target: [new InstantKillDamageMethod(0.3)]
    }
})

export const quickShotSkill = new Skill({
    id: 68,
    level: 1,
    key: 'thief/quick-shot',
    methods: {
        caster: [new SimpleManaMethod(-6)],
        target: [new DamageLevelMethod(8, 1)]
    }
})

export const poisonArrowSkill = new Skill({
    id: 69,
    level: 4,
    key: 'thief/poison-arrow',
    methods: {
        caster: [new SimpleManaMethod(-14)],
        target: [new SimpleEffectAddMethod(poisonEffect, 3)]
    }
})

export const stealCoinsSkill = new Skill({
    id: 70,
    level: 6,
    key: 'thief/steal-coins',
    methods: {
        caster: [new SimpleManaMethod(-10)],
        target: [new MoneyLevelMethod(8, 2)]
    }
})

export const fireArrowSkill = new Skill({
    id: 71,
    level: 9,
    key: 'thief/fire-arrow',
    methods: {
        caster: [new SimpleManaMethod(-18)],
        target: [new DamageLevelMethod(4, 1), new SimpleEffectAddMethod(emberEffect, 3)]
    }
})

export const smokeBombSkill = new Skill({
    id: 72,
    level: 12,
    key: 'thief/smoke-bomb',
    methods: {
        caster: [new SimpleManaMethod(-20), new SimpleEffectAddMethod(smokeBombEffect, 3)],
        target: []
    }
})

export const crossbowVolleySkill = new Skill({
    id: 73,
    level: 16,
    key: 'thief/crossbow-volley',
    methods: {
        caster: [new PercentManaMethod(-0.06)],
        target: [new RandomDamageMethod(20, 40)]
    }
})

export const evasionSkill = new Skill({
    id: 74,
    level: 20,
    key: 'thief/evasion',
    methods: {
        caster: [new PercentManaMethod(-0.08)],
        target: [new ReturnDamageMethod(0.35)]
    }
})

export const venomTrapSkill = new Skill({
    id: 75,
    level: 24,
    key: 'thief/venom-trap',
    methods: {
        caster: [new PercentManaMethod(-0.08)],
        target: [new SimpleEffectAddMethod(venomTrapEffect, 4)]
    }
})

export const backstabSkill = new Skill({
    id: 76,
    level: 28,
    key: 'thief/backstab',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new LostHealthDamageMethod(70)]
    }
})

export const cutStrapSkill = new Skill({
    id: 77,
    level: 32,
    key: 'thief/cut-strap',
    methods: {
        caster: [new PercentManaMethod(-0.12)],
        target: [new RemoveSkillMethod()]
    }
})

export const shadowCloakSkill = new Skill({
    id: 78,
    level: 36,
    key: 'thief/shadow-cloak',
    methods: {
        caster: [new PercentManaMethod(-0.1), new SimpleEffectAddMethod(shadowCloakEffect, 3)],
        target: []
    }
})

export const poisonedBoltSkill = new Skill({
    id: 79,
    level: 40,
    key: 'thief/poisoned-bolt',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new PercentDamageMethod(0.1), new PercentManaMethod(-0.08)]
    }
})

export const hookAndPullSkill = new Skill({
    id: 80,
    level: 45,
    key: 'thief/hook-and-pull',
    methods: {
        caster: [new PercentManaMethod(-0.15), new NextStepMethod()],
        target: [new DamageLevelMethod(10, 2)]
    }
})

export const masterPickpocketSkill = new Skill({
    id: 81,
    level: 52,
    key: 'thief/master-pickpocket',
    methods: {
        caster: [new PercentManaMethod(-0.1)],
        target: [new MoneyLevelMethod(30, 5)]
    }
})

export const assassinateSkill = new Skill({
    id: 82,
    level: 70,
    key: 'thief/assassinate',
    methods: {
        caster: [new PercentManaMethod(-0.2)],
        target: [new InstantKillDamageMethod(0.25)]
    }
})

export const skills: Skill[] = [
    devSkill,
    attackUniversalSkill,
    attackBardSkill,
    attackEngineerSkill,
    attackKnightSkill,
    attackSorcererSkill,
    attackThiefSkill,
    attackBossSkill,
    stringStrikeSkill,
    mockerySkill,
    inspiringMotifSkill,
    thievingBalladSkill,
    lullabySkill,
    dissonanceSkill,
    chordOfRetributionSkill,
    hymnOfResilienceSkill,
    deafeningNoteSkill,
    sirensLamentSkill,
    vampiricMelodySkill,
    skillTheftSkill,
    requiemSkill,
    finalChordSkill,
    absoluteHarmonySkill,
    gauntletPunchSkill,
    deployTurretSkill,
    repairKitSkill,
    shockTrapSkill,
    reactivePlatingSkill,
    oilSlickSkill,
    arcWelderSkill,
    droneShieldSkill,
    magneticPullSkill,
    scrapCannonSkill,
    emergencyVentSkill,
    scrapSalvageSkill,
    hijackSkill,
    selfDestructProtocolSkill,
    coreMeltdownSkill,
    slashSkill,
    shotgunBlastSkill,
    blockStanceSkill,
    armorPlatingSkill,
    deepCutSkill,
    shieldBashSkill,
    sunderArmorSkill,
    rallyingCrySkill,
    suppressiveFireSkill,
    disarmSkill,
    piercingShotSkill,
    lastStandSkill,
    riposteSkill,
    executionersShotSkill,
    indomitableSkill,
    arcaneBoltSkill,
    igniteSkill,
    manaShieldSkill,
    iceSpikeSkill,
    lightningBoltSkill,
    manaSpringSkill,
    arcaneWardSkill,
    dispelSkill,
    meteorSkill,
    timeFreezeSkill,
    arcaneSiphonSkill,
    silenceSkill,
    puppetStringsSkill,
    arcaneOverloadSkill,
    absoluteZeroSkill,
    quickShotSkill,
    poisonArrowSkill,
    stealCoinsSkill,
    fireArrowSkill,
    smokeBombSkill,
    crossbowVolleySkill,
    evasionSkill,
    venomTrapSkill,
    backstabSkill,
    cutStrapSkill,
    shadowCloakSkill,
    poisonedBoltSkill,
    hookAndPullSkill,
    masterPickpocketSkill,
    assassinateSkill,
]