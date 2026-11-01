import type Item from "../../utils/items/Item"
import { banItem, cardBoxItem, casinoBoostItem, cookieItem, coolShieldItem, defaultGunItem, skillsBookItem, greedBoxItem, infinityCasinoItem, levelBoostItem, moneyGeneratorItem, moneyGenLicenseItem, resetClassItem, resetSaveCooldownItem, simpleShieldItem, soapGunItem, thanksItem, unmuteItem, workBoostItem, workCatalogItem } from "./inventory"

export const shopItems: Item[] = [
    soapGunItem,
    cookieItem,
    workBoostItem,
    workCatalogItem,
    casinoBoostItem,
    infinityCasinoItem,
    unmuteItem,
    banItem,
    levelBoostItem,
    thanksItem,
    greedBoxItem,
    skillsBookItem,
    cardBoxItem,
    moneyGenLicenseItem,
    moneyGeneratorItem,
    resetClassItem,
    resetSaveCooldownItem,
    defaultGunItem,
    simpleShieldItem,
    coolShieldItem,
    // businessPaperItem,
]