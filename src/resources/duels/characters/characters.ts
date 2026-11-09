import Character from "../../../utils/duel/character/Character"
import type { ClassTypes } from "../../../types/class"
import { attackBardSkill, attackEngineerSkill, attackKnightSkill, attackSorcererSkill, attackThiefSkill, attackBossSkill, attackUniversalSkill, devSkill, absoluteHarmonySkill, chordOfRetributionSkill, deafeningNoteSkill, dissonanceSkill, finalChordSkill, hymnOfResilienceSkill, inspiringMotifSkill, lullabySkill, mockerySkill, requiemSkill, sirensLamentSkill, skillTheftSkill, stringStrikeSkill, thievingBalladSkill, vampiricMelodySkill, arcWelderSkill, coreMeltdownSkill, deployTurretSkill, droneShieldSkill, emergencyVentSkill, gauntletPunchSkill, hijackSkill, magneticPullSkill, oilSlickSkill, reactivePlatingSkill, repairKitSkill, scrapCannonSkill, scrapSalvageSkill, selfDestructProtocolSkill, shockTrapSkill, armorPlatingSkill, blockStanceSkill, deepCutSkill, disarmSkill, executionersShotSkill, indomitableSkill, lastStandSkill, piercingShotSkill, rallyingCrySkill, riposteSkill, shieldBashSkill, shotgunBlastSkill, slashSkill, sunderArmorSkill, suppressiveFireSkill, absoluteZeroSkill, arcaneBoltSkill, arcaneOverloadSkill, arcaneSiphonSkill, arcaneWardSkill, dispelSkill, iceSpikeSkill, igniteSkill, lightningBoltSkill, manaShieldSkill, manaSpringSkill, meteorSkill, puppetStringsSkill, silenceSkill, timeFreezeSkill, assassinateSkill, backstabSkill, crossbowVolleySkill, cutStrapSkill, evasionSkill, fireArrowSkill, hookAndPullSkill, masterPickpocketSkill, poisonArrowSkill, poisonedBoltSkill, quickShotSkill, shadowCloakSkill, smokeBombSkill, stealCoinsSkill, venomTrapSkill } from "../skills/skills"
export const bardCharacter = new Character({
    hp: {
        start: 80,
        up: 9
    },
    mana: {
        start: 90,
        up: 11
    },
    skills: {
        main: attackBardSkill,
        showable: [
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
        ]
    }
})

export const botCharacter = new Character({
    hp: {
        start: 999_999_999,
        up: 0
    },
    mana: {
        start: 999_999_999,
        up: 0
    },
    skills: {
        main: attackUniversalSkill,
        showable: [
            devSkill
        ]
    }
})

export const engineerCharacter = new Character({
    hp: {
        start: 60,
        up: 8
    },
    mana: {
        start: 100,
        up: 11
    },
    skills: {
        main: attackEngineerSkill,
        showable: [
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
        ]
    }
})

export const knightCharacter = new Character({
    hp: {
        start: 110,
        up: 11
    },
    mana: {
        start: 60,
        up: 6
    },
    skills: {
        main: attackKnightSkill,
        showable: [
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
        ]
    }
})

export const sorcererCharacter = new Character({
    hp: {
        start: 80,
        up: 8
    },
    mana: {
        start: 100,
        up: 20
    },
    skills: {
        main: attackSorcererSkill,
        showable: [
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
        ]
    }
})

export const thiefCharacter = new Character({
    hp: {
        start: 90,
        up: 9
    },
    mana: {
        start: 80,
        up: 11
    },
    skills: {
        main: attackThiefSkill,
        showable: [
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
    }
})

export const unknownCharacter = new Character({
    hp: {
        start: 0,
        up: 0
    },
    mana: {
        start: 0,
        up: 0
    },
    skills: {
        main: attackUniversalSkill,
        showable: [
            devSkill
        ]
    }
})

export const bossCharacter = new Character({
    hp: {
        start: 2277,
        up: 1
    },
    mana: {
        start: 1961,
        up: 1
    },
    skills: {
        main: attackBossSkill,
        showable: new Set([
            ...knightCharacter.skills.showable,
            ...thiefCharacter.skills.showable,
            ...sorcererCharacter.skills.showable,
            ...engineerCharacter.skills.showable,
            ...bardCharacter.skills.showable,
        ]).values().toArray()
    }
})

export const characters: Record<ClassTypes, Character> = {
    knight: knightCharacter,
    thief: thiefCharacter,
    sorcerer: sorcererCharacter,
    engineer: engineerCharacter,
    bard: bardCharacter,
    unknown: unknownCharacter,
    boss: bossCharacter,
    bot: botCharacter
}