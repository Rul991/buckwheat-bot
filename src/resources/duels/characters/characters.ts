import Character from "../../../utils/duel/character/Character"
import type { ClassTypes } from "../../../types/class"
import {
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
} from "../../../resources/duels/skills/skills"

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
            stringSkill,
            laughSinSkill,
            whiteDefenderSkill,
            scaryNotesSkill,
            sleepMelodySkill,
            jimmySkill,
            yeahRockSkill,
            staySkill,
            lampSkill,
            koffySkill,
            chiliRiffSkill,
            angryPickSkill,
            manaUpSkill,
            heroSongSkill,
            punkRockSkill,
            guitarHeroSkill,
            kingSongSkill,
            hardRockSkill,
            weDieSkill,
            angleSkill,
            sunUpSkill,
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
        main: attackBotSkill,
        showable: []
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
            rockVoidSkill,
            oneTowerSkill,
            woodSwordSkill,
            droneSkill,
            phantomSkill,
            onSkySkill,
            drillSkill,
            sleepSkill,
            electroSkill,
            towerSkill,
            feedbackSkill,
            artifactSkill,
            coolArmorSkill,
            masterOfFieldSkill,
            chainTrapSkill,
            flutterSkill,
            atheistSkill,
            womanetSkill,
            loveSkill,
            ironManSkill,
            morgartSkill,
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
            shieldSkill,
            subwaysurfSkill,
            gunSkill,
            goGoSkill,
            envellSkill,
            kysSkill,
            superSkill,
            stfuLightSkill,
            maadSkill,
            grenadeSkill,
            ironSkill,
            gloveSkill,
            breakSkill,
            piglinsSkill,
            phenixSkill,
            crossSkill,
            shieldPlusSkill,
            whiteDefSkill,
            lShieldSkill,
            finishSkill,
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
            attackSorcererSkill,
            iceSkill,
            fimaSkill,
            ashSkill,
            sugarRainSkill,
            fimaPlusSkill,
            showerSkill,
            creepSkill,
            circleSkill,
            yammySkill,
            lStoreSkill,
            lockShldSkill,
            thndrSkill,
            dblFghtSkill,
            lstLgtSkill,
            qsrSkill,
            crptSkill,
            chaosSkill,
            godHealSkill,
            chillSkill,
            endSkill,
            ktaroHiSkill,
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
            frarrSkill,
            theftSkill,
            invisSkill,
            forkSkill,
            hrdArrSkill,
            orbitSkill,
            crookSkill,
            ffwfSkill,
            maximSkill,
            honeySkill,
            keySkill,
            blackSkill,
            noSkillSkill,
            twoHandSkill,
            friendSkill,
            hideSkill,
            trSkill,
            key85Skill,
            clfrSkill,
            asuraSkill,
            gtaSkill,
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
        main: attackUnknownSkill,
        showable: []
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
        showable: [
            ...knightCharacter.skills.showable,
            ...thiefCharacter.skills.showable,
            ...sorcererCharacter.skills.showable,
            ...engineerCharacter.skills.showable,
            ...bardCharacter.skills.showable,
        ]
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